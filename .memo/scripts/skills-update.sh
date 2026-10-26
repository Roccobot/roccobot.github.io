#!/usr/bin/env bash
# Riscarica le skill di terzi che vivono in .agents/skills/ e le ricopia come file veri.
#
# Perché esiste: quelle skill sono file committati, quindi restano alla versione del giorno in
# cui sono entrate. Le aggiorna la Routine mensile 'Aggiornamento skill di terzi', che lancia
# questo script e apre una PR SENZA mergiarla: sono file di terzi che girano coi permessi
# dell'agente, e un aggiornamento si accetta guardando il diff (istruzione dell'utente,
# 2026-09-25: una volta al mese, e il commit entra solo col suo via libera).
#
# Perché non `skills update`: nel repo non c'è `skills-lock.json`, perché i file sono copiati
# veri e non come collegamenti simbolici. (`.agents/skills/` c'è dal 2026-09-27, ma è la cartella
# vera delle skill, con `.claude/skills` che la collega: non è lo stato che `skills` tiene.)
# Quindi ogni pacchetto si reinstalla da capo in una cartella di lavoro, UNO PER VOLTA: con più
# argomenti insieme il comando tiene solo l'ultimo (misurato il 2026-09-23).
#
# Ogni skill si sostituisce per intero, così un file tolto a monte esce anche da qui. Le skill di
# casa non si toccano, e quelle che nessun pacchetto fornisce più, perché gli autori le hanno
# ritirate, si cancellano e si segnalano con `RIMOSSA` (scelta dell'utente, 2026-10-26: una skill
# ritirata dagli autori non si tiene nell'archivio, mentre una ancora fornita ma ferma si
# rivaluta ogni sei mesi). Per recuperarne una si guarda `docs/Removed.md`.
#
# I file di queste skill sono degli autori: i controlli sui caratteri (trattini lunghi, caporali,
# accenti) non li guardano, salvo le skill di casa (`refcheck.py`, `SKILL_DI_CASA`; scelta
# Skill-01 dell'utente, 2026-10-26, dopo che la corsa di ottobre si era fermata su 1.463 righe).
set -euo pipefail

RADICE="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$RADICE/.agents/skills"
CASA=(handoff epub blend)
# Copiate a mano da un repo che non è in PACCHETTI: lo script non le aggiorna e non le segnala come
# 'ritirate' e non le cancella (la corsa del 2026-10-26 segnalò così `security-audit`, di Cloudflare).
MANUALI=(security-audit)
# 'VoltAgent/awesome-design-md' non c'è di proposito: non porta nessun SKILL.md, quindi non è
# una skill ma una raccolta di documenti.
PACCHETTI=(
  nextlevelbuilder/ui-ux-pro-max-skill
  Leonxlnx/taste-skill
  pbakaus/impeccable
  google-labs-code/design.md
  Nutlope/hallmark
  cathrynlavery/diagram-design
  tt-a1i/archify
  blader/humanizer
  charlie947/voiceprint
  charlie947/answer-first
  hardikpandya/stop-slop
  Egonex-AI/Understand-Anything
  ayghri/i-have-adhd
  zarazhangrui/frontend-slides
)

LAVORO="$(mktemp -d)"
trap 'rm -rf "$LAVORO"' EXIT
cd "$LAVORO"

FALLITI=0
for p in "${PACCHETTI[@]}"; do
  if npx -y skills add "$p" >/dev/null 2>&1; then echo "ok        $p"; else echo "FALLITO   $p"; FALLITI=$((FALLITI + 1)); fi
done

FRESCHE="$LAVORO/.agents/skills"
if [ ! -d "$FRESCHE" ] || [ -z "$(ls -A "$FRESCHE")" ]; then
  echo "nessuna skill scaricata: il repo non è stato toccato" >&2
  exit 1
fi

for d in "$FRESCHE"/*/; do
  n="$(basename "$d")"
  rm -rf "${DEST:?}/$n"
  cp -rL "$d" "$DEST/$n"
done

for d in "$DEST"/*/; do
  n="$(basename "$d")"
  [[ " ${CASA[*]} ${MANUALI[*]} " == *" $n "* ]] && continue
  [ -d "$FRESCHE/$n" ] && continue
  # Con un pacchetto fallito la skill potrebbe mancare solo perché non è stata scaricata: si
  # segnala e non si cancella.
  if [ "$FALLITI" -gt 0 ]; then echo "NON PIÙ FORNITA (forse: pacchetto fallito, non rimossa)   $n"; else rm -rf "${DEST:?}/$n"; echo "RIMOSSA   $n"; fi
done
