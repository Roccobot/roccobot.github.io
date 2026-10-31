#!/usr/bin/env python3
"""Regression checks for punctuation, the narrowly approved source quotations, and the input
of the --text and --diff modes.

Author: Rocco Casadei, a.k.a. Roccobot
"""
import importlib.util
import os
import pty
import subprocess
import sys
import shutil
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('refcheck.py')
spec = importlib.util.spec_from_file_location('refcheck', SCRIPT)
refcheck = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refcheck)


class CaporaliTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Use isolated neighbouring repositories so these checks also run in CI where
        # the private tools repository cannot be cloned.
        cls.fixture = tempfile.TemporaryDirectory()
        base = Path(cls.fixture.name)
        scripts = base / 'hub/.memo/scripts'
        scripts.mkdir(parents=True)
        cls.command_script = scripts / 'refcheck.py'
        shutil.copyfile(SCRIPT, cls.command_script)
        shutil.copyfile(SCRIPT.with_name('char-exceptions.json'),
                        scripts / 'char-exceptions.json')
        cls.original_site, cls.original_tools = refcheck.SITO, refcheck.TOOLS
        refcheck.SITO, refcheck.TOOLS = base / 'hub', base / 'tools'
        refcheck.TOOLS.mkdir()

    @classmethod
    def tearDownClass(cls):
        refcheck.SITO, refcheck.TOOLS = cls.original_site, cls.original_tools
        cls.fixture.cleanup()

    def test_prose_is_rejected(self):
        for text in ('Testo \u00abnon ammesso\u00bb.', '\u00abApertura', 'Chiusura\u00bb'):
            with self.subTest(text=text):
                self.assertTrue(refcheck.char_defects(text))

    def test_text_command_rejects_prose(self):
        result = subprocess.run([sys.executable, str(self.command_script), '--text'],
                                input='Testo \u00abnon ammesso\u00bb.', text=True,
                                capture_output=True)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_literal_character_names_remain_valid(self):
        self.assertEqual(refcheck.char_defects('Caratteri vietati: `\u00ab` e `\u00bb`.'), [])

    def test_authorized_source_quote_is_narrow(self):
        quote = '\u00abTutte le cose hanno un nome\u00bb'
        path = refcheck.TOOLS / 'rules/Earthsea.md'
        self.assertEqual(refcheck.char_defects(quote, path), [])
        self.assertTrue(refcheck.char_defects(quote))
        self.assertTrue(refcheck.char_defects(quote, refcheck.TOOLS / 'Rules.md'))
        self.assertTrue(refcheck.char_defects('\u00abUna frase nuova\u00bb', path))

    def test_multiline_source_quote_survives_reflow(self):
        quote = '\u00abUn Signore dei Draghi è uno\n  con cui i draghi parlano\u00bb'
        self.assertEqual(refcheck.char_defects(quote, refcheck.TOOLS / 'rules/Earthsea.md'), [])

    def test_source_exception_does_not_hide_other_defects(self):
        quote = '\u00abTutte le cose hanno un nome\u00bb'
        defects = refcheck.char_defects(quote + ' Testo\u2014sbagliato.',
                                        refcheck.TOOLS / 'rules/Earthsea.md')
        self.assertEqual([d[2] for d in defects], ['\u2014'])

    def test_diff_rejects_new_prose(self):
        diff = 'diff --git a/Rules.md b/Rules.md\n--- a/Rules.md\n+++ b/Rules.md\n@@ -1 +1 @@\n-Testo\n+Testo \u00abnon ammesso\u00bb.\n'
        result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                input=diff, text=True, capture_output=True,
                                cwd=refcheck.TOOLS)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_diff_allows_only_registered_quote(self):
        for quote, expected in (('\u00abTutte le cose hanno un nome\u00bb', 0),
                                ('\u00abUna frase nuova\u00bb', 1)):
            diff = 'diff --git a/rules/Earthsea.md b/rules/Earthsea.md\n--- a/rules/Earthsea.md\n+++ b/rules/Earthsea.md\n@@ -1 +1 @@\n-Testo\n+' + quote + '\n'
            result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                    input=diff, text=True, capture_output=True,
                                    cwd=refcheck.TOOLS)
            self.assertEqual(result.returncode, expected, result.stdout)


    def test_diff_checks_unchanged_delimiters_when_quote_body_changes(self):
        approved = '\u00abUn Signore dei Draghi è uno\ncon cui i draghi parlano\u00bb'
        path = refcheck.TOOLS / 'rules/Earthsea.md'
        self.assertEqual(refcheck.diff_quote_defects(approved, path, {2}), [])
        changed = approved.replace('i draghi', 'i maghi')
        self.assertEqual(len(refcheck.diff_quote_defects(changed, path, {2})), 2)

    def test_diff_preserves_context_for_multiline_quotes(self):
        for body, expected in (('con cui i draghi parlano', 0),
                               ('con cui i maghi parlano', 1)):
            diff = ('diff --git a/rules/Earthsea.md b/rules/Earthsea.md\n'
                    '--- a/rules/Earthsea.md\n+++ b/rules/Earthsea.md\n'
                    '@@ -1,2 +1,2 @@\n \u00abUn Signore dei Draghi è uno\n'
                    '-vecchio testo\u00bb\n+' + body + '\u00bb\n')
            result = subprocess.run([sys.executable, str(self.command_script), '--diff'],
                                    input=diff, text=True, capture_output=True,
                                    cwd=refcheck.TOOLS)
            self.assertEqual(result.returncode, expected, result.stdout)

    def test_exception_does_not_cover_prose_after_the_quote(self):
        text = '\u00abTutte le cose hanno un nome\u00bb e \u00abun commento\u00bb'
        defects = refcheck.char_defects(text, refcheck.TOOLS / 'rules/Earthsea.md')
        self.assertEqual([d[2] for d in defects], ['\u00ab', '\u00bb'])


class ThirdPartySkillTests(unittest.TestCase):
    """The files of third-party skills are the authors' own: the monthly routine replaces them
    whole, so the diff checks leave them alone. Only the two house skills stay checked."""

    @staticmethod
    def block(path, line):
        return ('diff --git a/%s b/%s\n--- a/%s\n+++ b/%s\n@@ -1 +1 @@\n-old\n+%s\n'
                % (path, path, path, path, line))

    def run_diff(self, diff):
        return subprocess.run([sys.executable, str(SCRIPT), '--diff'], input=diff, text=True,
                              capture_output=True, cwd=tempfile.gettempdir())

    def test_which_paths_count_as_third_party(self):
        cases = {'.agents/skills/hallmark/SKILL.md': True,
                 '.agents/skills/hallmark/scripts/install-hook.mjs': True,
                 '.agents/skills/handoff/SKILL.md': False,
                 '.agents/skills/epub/SKILL.md': False,
                 '.agents/skills/blend/blend_css.py': False,
                 '.agents/skills-extra/x/SKILL.md': False,
                 'docs/.agents/skills/x/SKILL.md': False,
                 'Rules.md': False}
        for path, expected in cases.items():
            with self.subTest(path=path):
                self.assertEqual(refcheck.skill_di_terzi(path), expected)

    def test_the_filter_drops_only_third_party_blocks(self):
        mixed = (self.block('.agents/skills/hallmark/SKILL.md', 'a \u2014 b')
                 + self.block('.agents/skills/handoff/SKILL.md', 'c')
                 + self.block('Rules.md', 'd'))
        kept = refcheck.senza_terzi(mixed)
        self.assertNotIn('hallmark', kept)
        self.assertIn('handoff', kept)
        self.assertIn('Rules.md', kept)

    def test_diff_ignores_a_third_party_skill_and_checks_a_house_skill(self):
        line = 'Testo \u00abnon ammesso\u00bb.'
        third = self.run_diff(self.block('.agents/skills/hallmark/SKILL.md', line))
        house = self.run_diff(self.block('.agents/skills/handoff/SKILL.md', line))
        self.assertEqual(third.returncode, 0, third.stdout)
        self.assertEqual(house.returncode, 1, house.stdout)

    def test_git_hook_ignores_long_dashes_in_a_third_party_skill_only(self):
        githook_spec = importlib.util.spec_from_file_location(
            'githook', SCRIPT.with_name('githook.py'))
        githook = importlib.util.module_from_spec(githook_spec)
        githook_spec.loader.exec_module(githook)
        line = 'a \u2014 b'
        third = githook.check_diff(self.block('.agents/skills/hallmark/scripts/x.mjs', line))
        house = githook.check_diff(self.block('.agents/skills/handoff/scripts/x.py', line))
        self.assertFalse([p for p in third if 'trattino lungo' in p], third)
        self.assertTrue([p for p in house if 'trattino lungo' in p], house)


class InputTests(unittest.TestCase):
    """A mode that reads text must say so when it read nothing.

    On 2026-10-08 a session ran `refcheck.py --text FILE`: the path was ignored, the empty stdin
    of the shell was checked instead, and the text was declared clean with exit 0. With a stdin
    that never closes the same command waited until it was killed.
    """

    def run_script(self, *args, stdin=subprocess.DEVNULL, input=None):
        kwargs = {'input': input} if input is not None else {'stdin': stdin}
        return subprocess.run([sys.executable, str(SCRIPT), *args], text=True,
                              capture_output=True, timeout=refcheck.ATTESA_INGRESSO + 30,
                              **kwargs)

    def write(self, text):
        handle = tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False, encoding='utf-8')
        with handle:
            handle.write(text)
        self.addCleanup(os.unlink, handle.name)
        return handle.name

    def test_empty_input_is_an_error(self):
        for mode in ('--text', '--diff'):
            for text in ('', '\n\n'):
                with self.subTest(mode=mode, text=text):
                    result = self.run_script(mode, input=text)
                    self.assertEqual(result.returncode, 2, result.stdout)
                    self.assertIn('nessun testo in ingresso', result.stdout)

    def test_text_reads_the_named_file(self):
        result = self.run_script('--text', self.write('Un apice curvo: l\u2019errore.\n'))
        self.assertEqual(result.returncode, 1, result.stdout)
        result = self.run_script('--text', self.write('Un testo in regola.\n'))
        self.assertEqual(result.returncode, 0, result.stdout)

    def test_diff_reads_the_named_file(self):
        diff = ('diff --git a/Rules.md b/Rules.md\n--- a/Rules.md\n+++ b/Rules.md\n'
                '@@ -1 +1 @@\n-Testo\n+Testo \u00abnon ammesso\u00bb.\n')
        with tempfile.TemporaryDirectory() as empty:
            result = subprocess.run([sys.executable, str(SCRIPT), '--diff', self.write(diff)],
                                    text=True, capture_output=True, cwd=empty,
                                    stdin=subprocess.DEVNULL, timeout=30)
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_missing_or_empty_file_is_an_error(self):
        cases = [(mode, path) for mode in ('--text', '--diff')
                 for path in ('/nessun/file/qui.txt', self.write(''))]
        # --html and --fix already refused a run without a file; a missing one answered 1 and 0.
        cases += [(mode, '/nessun/file/qui.html') for mode in ('--html', '--fix')]
        for mode, path in cases:
            with self.subTest(mode=mode, path=path):
                result = self.run_script(mode, path)
                self.assertEqual(result.returncode, 2, result.stdout)

    def test_silent_stdin_does_not_hang(self):
        # A pipe whose writer stays open and silent, as in the remote Bash tool of that session.
        process = subprocess.Popen([sys.executable, str(SCRIPT), '--text'], text=True,
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        try:
            code = process.wait(timeout=refcheck.ATTESA_INGRESSO + 30)
        finally:
            process.kill()
            process.stdin.close()
            out = process.stdout.read()
            process.stdout.close()
        self.assertEqual(code, 2, out)
        self.assertIn('nessun testo in ingresso', out)

    def test_terminal_stdin_is_an_error(self):
        master, slave = pty.openpty()
        try:
            result = self.run_script('--text', stdin=slave)
        finally:
            os.close(slave)
            os.close(master)
        self.assertEqual(result.returncode, 2, result.stdout)



class RepoPathTests(unittest.TestCase):
    """A path written with the repository in front, `Roccobot/tools/.memo/LATEST.md`, lives in
    that repository's clone.

    On 2026-10-08, with every project repository mounted, three correct paths in the rules of
    AIV were reported as missing and blocked every commit on a rule file: the check looked for
    a `Roccobot/` folder inside the hub, and the paths had passed only as unverifiable while
    some project was not cloned.
    """

    def setUp(self):
        fixture = tempfile.TemporaryDirectory()
        self.addCleanup(fixture.cleanup)
        tools = Path(fixture.name) / 'tools'
        (tools / '.memo').mkdir(parents=True)
        (tools / '.memo/LATEST.md').write_text('brief', encoding='utf-8')
        original = refcheck.TOOLS
        refcheck.TOOLS = tools
        self.addCleanup(setattr, refcheck, 'TOOLS', original)

    def test_existing_file_in_the_named_repo_is_found(self):
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/LATEST.md'), 'ok')

    def test_missing_file_in_the_named_repo_is_broken(self):
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/OLD.md'), 'rotto')

    def test_repo_without_a_clone_is_unverifiable(self):
        refcheck.TOOLS = refcheck.TOOLS.parent / 'absent'
        self.assertEqual(refcheck.stato_in_repo('Roccobot/tools/.memo/LATEST.md'), 'assente')

    def test_other_paths_are_left_to_the_usual_check(self):
        for path in ('rules/Roccobot.md', 'Roccobot/tools', 'Roccobot/nobody/file.md'):
            with self.subTest(path=path):
                self.assertIsNone(refcheck.stato_in_repo(path))

class SpaceSymbolTests(unittest.TestCase):
    """The space bar's symbol, U+2423, is a Mac key like ⏎ and is allowed in prose (the feedback
    documents write it with ⌘⇧ and the space bar, 2026-10-16); its neighbours stay out."""

    def check(self, text):
        with tempfile.NamedTemporaryFile('w', suffix='.md', encoding='utf-8', delete=False) as handle:
            handle.write(text)
        self.addCleanup(os.unlink, handle.name)
        return subprocess.run([sys.executable, str(SCRIPT), '--text', handle.name],
                              capture_output=True, text=True)

    def test_the_space_symbol_passes(self):
        result = self.check('Il tasto ⌘⇧␣ scrive ␣ nel campo.\n')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_its_neighbour_is_still_refused(self):
        result = self.check('Un simbolo vicino: ␤.\n')
        self.assertNotEqual(result.returncode, 0, result.stdout)


class AbsentProjectTests(unittest.TestCase):
    """A line that names a project whose repository is not cloned, by the name the texts use
    ('Aomidori', 'Terramare'), makes its paths unverifiable, not missing.

    On 2026-10-16 rules-check of tools, where only the hub and tools are cloned, reported eleven
    correct paths of AIV and Aomidori as missing (`docs/AppStore.md` next to 'Aomidori'), and
    was red on every commit: only `Roccobot/Aomidori` was recognised.
    """

    def setUp(self):
        original = refcheck.PROGETTI
        refcheck.PROGETTI = {**original, 'Aomidori': Path('/absent/Aomidori'), 'earthsea': Path('/absent/earthsea')}
        self.addCleanup(setattr, refcheck, 'PROGETTI', original)

    def test_the_plain_name_of_an_absent_project_counts(self):
        for line in ('i passi di TestFlight (`docs/AppStore.md`) di Aomidori',
                     'nel registro di Terramare: `docs/Dependencies.json`'):
            with self.subTest(line=line):
                self.assertTrue(refcheck.cita_progetto_assente([line], 0))

    def test_the_repository_name_still_counts(self):
        self.assertTrue(refcheck.cita_progetto_assente(['vedi `Roccobot/earthsea`'], 0))

    def test_other_words_do_not_count(self):
        for line in ('le regole di `docs/Workflow.md`', 'un aomidori scritto in minuscolo',
                     'la parola Terramareggiata'):
            with self.subTest(line=line):
                self.assertFalse(refcheck.cita_progetto_assente([line], 0))

    def test_a_cloned_project_does_not_count(self):
        refcheck.PROGETTI = {**refcheck.PROGETTI, 'Aomidori': Path(__file__).resolve().parent}
        self.assertFalse(refcheck.cita_progetto_assente(['`docs/AppStore.md` di Aomidori'], 0))


class RemovedFileTests(unittest.TestCase):
    """Every repository's `docs/Removed.md` is a rule file, so its titles can be cited.

    On 2026-10-25 (`Dieta`) the rule files of CleanSVG and cheparolae began to point to a
    section of their `docs/Removed.md`, and the correct references were reported as missing
    sections, which blocked every commit: those files were outside the index.
    """

    def test_removed_files_are_indexed(self):
        # Only the files that exist: a repository that is not cloned (AIV and Aomidori are private,
        # so the rules-check workflow cannot clone them) has nothing to index.
        indicizzati = set(refcheck.RULEFILES)
        for repo in (refcheck.SITO, refcheck.TOOLS, refcheck.AIV, *refcheck.PROGETTI.values()):
            path = repo / 'docs/Removed.md'
            if not path.exists():
                continue
            with self.subTest(repo=repo.name):
                self.assertTrue(path in indicizzati, f'{path} is not indexed')


class BriefDoneTests(unittest.TestCase):
    """A brief entry marked as done is an error: it has to be deleted, not annotated.

    On 2026-10-10 the brief had grown to 2,479 lines of release history, with 126 check
    marks the day before, because sessions logged 'fatta e pubblicata' at each release.
    """

    def check(self, testo):
        with tempfile.TemporaryDirectory() as cartella:
            path = Path(cartella) / 'LATEST.md'
            path.write_text(testo, encoding='utf-8')
            return refcheck.check_brief_evase(path)

    def test_check_mark_is_rejected(self):
        difetti, _ = self.check('# Handoff\n- ✅ **4.97 fatta**: release v4.97\n')
        self.assertEqual([n for _, n, _ in difetti], [2])

    def test_written_formula_is_rejected(self):
        difetti, _ = self.check('- **La 4.96 è Fatta e pubblicata** il 2026-10-09\n')
        self.assertEqual(len(difetti), 1)

    def test_open_entries_pass(self):
        difetti, nota = self.check('- **Da fare**: la stringa della filigrana\n'
                                   '- la 0.52 è pubblicata, la 0.60 è in uscita\n')
        self.assertEqual((difetti, nota), ([], None))

    def test_long_brief_is_only_a_warning(self):
        difetti, nota = self.check('- voce aperta\n' * (refcheck.BRIEF_RIGHE_AVVISO + 1))
        self.assertEqual(difetti, [])
        self.assertIn('brief lungo', nota)


class SymbolTests(unittest.TestCase):
    """Arrows are symbols the rules use, whatever block they are in.

    On 2026-10-16 the circular arrows of Aomidori's rotate items (U+27F2, U+27F3) were refused in
    the brief: Supplemental Arrows-A was missing from the declared ranges, and no rule forbids it.
    """

    def test_circular_arrows_pass(self):
        self.assertEqual(refcheck.char_defects('Ruota immagine a sinistra ⟲, a destra ⟳.'), [])


class LexiconTests(unittest.TestCase):
    """The user's lexical corrections block a commit, and a word named in code still passes.

    On 2026-10-15 the user corrected two words in chat, centratura and orientamento: the first
    had been a preference in `Roccobot.md` for months, and nothing checked it.
    """

    def test_corrected_words_are_rejected(self):
        for text in ('La prova del centraggio.', 'I centraggi delle pagine.',
                     "Un'orientazione EXIF nuova."):
            with self.subTest(text=text):
                self.assertTrue(refcheck.formula_defects(text)[0])

    def test_named_words_pass(self):
        self.assertEqual(refcheck.formula_defects('Si dice centratura, mai `centraggio`.')[0], [])

    def test_feedback_document_in_linea_is_rejected(self):
        # The same day: a published page is online; in Italian 'in linea' is someone reachable
        # on a chat or a call.
        for text in ('Il DF 2.00 è in linea.', '**DF 6.21 in linea** (AIV#615).',
                     'Il documento di feedback del giro 1.73 è in linea.'):
            with self.subTest(text=text):
                self.assertTrue(refcheck.formula_defects(text)[0])

    def test_published_in_linea_is_a_warning(self):
        blocks, warnings = refcheck.formula_defects('La pagina nuova è in linea da stamattina.')
        self.assertEqual((len(blocks), len(warnings)), (0, 1))

    def test_other_senses_of_in_linea_pass(self):
        for text in ('Lo copia come codice in linea.', 'Niente stili in linea nel capitolo.',
                     'La resa è in linea con le preferenze.', 'Il DF è in linea di principio.',
                     'Sotto, in linea e allineati a destra, i chip.',
                     'Blocca accanto al documento di feedback e avvisa su `è in linea`.'):
            with self.subTest(text=text):
                self.assertEqual(refcheck.formula_defects(text), ([], []))

    def test_ui_text_chosen_by_the_owner_passes_only_where_registered(self):
        # Parola (2026-10-19): a text the owner chose word for word passes in the file it is
        # registered for, and only as written. A registry of the test's own: the real one changes
        # with the sites (on 2026-10-27 the phrase with 'roba' left Aomidori's site, and with it
        # the registry entry this test used to read).
        page = refcheck.SITO / 'Aomidori/index.html'
        chosen = "niente roba AI a pagamento"
        line = "claim: 'Niente fuffa, niente lettura audio, niente roba AI a pagamento.',"
        with tempfile.TemporaryDirectory() as folder:
            registry = Path(folder) / 'char-exceptions.json'
            registry.write_text('{"quotes": [], "ui_texts": [{"repository": "roccobot.github.io", '
                                '"path": "Aomidori/index.html", "text": "' + chosen + '"}]}', encoding='utf-8')
            saved, refcheck.EXCEPTIONS = refcheck.EXCEPTIONS, registry
            try:
                self.assertEqual(refcheck.formula_defects(line, page)[0], [])
                for text, path in ((line, refcheck.SITO / 'Rules.md'),
                                   ("claim: 'Niente roba inutile.',", page),
                                   ("claim: 'Niente roba IA a pagamento.',", page)):
                    with self.subTest(text=text, path=path):
                        self.assertTrue(refcheck.formula_defects(text, path)[0])
            finally:
                refcheck.EXCEPTIONS = saved


class BriefCardTests(unittest.TestCase):
    """Every pending job with a code name has a link to its card on the Trello board."""

    BRIEF = """# Handoff

## In sospeso

### Aomidori: `Travaso`, convertire EPUB e Markdown (richiesta del 2026-10-27)

Card: [Travaso](https://trello.com/c/ftlz3OVq) (`Da fare Aomidori`).

### `Tools`: `Glossa`, proposta ritirata (sessione `Aomidori`, 2026-10-31)

Testo della voce, senza card.

### AIV: stato e coda dei lavori (Claude Code, `AIV`, 2026-10-27)

Nessun nome in codice nel titolo.

### `Universale-01`: due regole da rileggere

Card: [Universale-01](https://trello.com/c/CHHT0MAm).

### `Obolo-01`: l'acquisto una tantum

Testo che cita [Travaso](https://trello.com/c/ftlz3OVq) e non la sua card.

## Decisioni dell'utente

### `Fuori`: una voce fuori da In sospeso non conta
"""

    def check(self, text):
        with tempfile.TemporaryDirectory() as folder:
            brief = Path(folder) / 'LATEST.md'
            brief.write_text(text, encoding='utf-8')
            return [m for _, _, m in refcheck.check_brief_card(brief)]

    def test_only_the_jobs_without_their_card_are_reported(self):
        found = self.check(self.BRIEF)
        self.assertEqual(len(found), 2, found)
        self.assertIn('`Glossa`', found[0])
        self.assertIn('`Obolo-01`', found[1])

    def test_repo_and_session_names_are_not_code_names(self):
        self.assertFalse(any('`Tools`' in m or '`AIV`' in m or '`Aomidori`' in m
                             for m in self.check(self.BRIEF)))

    def test_a_brief_with_every_card_passes(self):
        text = (self.BRIEF.replace('Testo della voce, senza card.',
                                   'Card: [Glossa](https://trello.com/c/vTIvS0J9).')
                .replace('e non la sua card.', 'e la sua [Obolo](https://trello.com/c/3JhuoJ8v).'))
        self.assertEqual(self.check(text.replace('`Obolo-01`', '`Obolo`')), [])

    def test_any_number_makes_a_code_name(self):
        for code in ('Nota-7', 'Nota-123', 'Icona-06a'):
            with self.subTest(code=code):
                text = f"## In sospeso\n\n### `{code}`: una voce\n\nSenza card.\n"
                self.assertEqual(len(self.check(text)), 1)
                linked = text.replace('Senza card.', f'[{code}](https://trello.com/c/abc123)')
                self.assertEqual(self.check(linked), [])


if __name__ == '__main__':
    unittest.main()
