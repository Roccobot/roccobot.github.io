#!/usr/bin/env bash
# Riscarica le skill di terzi che vivono in .claude/skills/ e le ricopia come file veri.
#
# Perché esiste: quelle skill sono file committati, quindi restano alla versione del giorno in
# cui sono entrate. Le aggiorna la Routine mensile 'Aggiornamento skill di terzi', che lancia
# questo script e apre una PR SENZA mergiarla: sono file di terzi che girano coi permessi
# dell'agente, e un aggiornamento si accetta guardando il diff (istruzione dell'utente,
# 2026-09-25: una volta al mese, e il commit entra solo col suo via libera).
#
# Perché non `skills update`: nel repo non ci sono `skills-lock.json` né `.agents/`, perché i
# file sono copiati veri e non come collegamenti simbolici. Quindi ogni pacchetto si reinstalla
# da capo in una cartella di lavoro, UNO PER VOLTA: con più argomenti insieme il comando tiene
# solo l'ultimo (misurato il 2026-09-23).
#
# Ogni skill si sostituisce per intero, così un file tolto a monte esce anche da qui. Le skill di
# casa non si toccano, e quelle che nessun pacchetto porta più si segnalano senza cancellarle: a
# decidere è chi guarda la PR.
set -euo pipefail

RADICE="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$RADICE/.claude/skills"
CASA=(handoff)
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

for p in "${PACCHETTI[@]}"; do
  if npx -y skills add "$p" >/dev/null 2>&1; then echo "ok        $p"; else echo "FALLITO   $p"; fi
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
  [[ " ${CASA[*]} " == *" $n "* ]] && continue
  [ -d "$FRESCHE/$n" ] || echo "NON PIÙ FORNITA   $n"
done
