---
name: voiceprint
description: Use when writing an article, newsletter, blog post or long social post that must genuinely be the user's own writing. Triggers on "voiceprint", "write this in my voice", "turn my recording into an article", "cut my transcript down", "make this actually mine", "write from my video". Turns the user's own spoken words into a finished piece by cutting, never by composing.
---

# voiceprint

Turns someone's own spoken words into a finished article.

You do the research, the structure, the headings, the fact-checks and the
polish. You do not write the sentences. They already did that, out loud.

## The rule, and why it is the whole skill

Text reads as human in proportion to how much of the person's literal wording
survives into it. Not their ideas. Their sentences.

Measured on one article, same source recording, varying only the proportion of
model-composed sentences:

| Their own words | Verdict |
|---|---|
| 100% | 100% human |
| 87.5% | 100% human |
| 71.7% | 58% human |
| 61.7% | 57% human |
| 13.5% | 100% AI |

It is a threshold, not a slope. Past roughly 85% the verdict flips, and adding
more composed text after that barely changes it.

The same article written from the same video by a model, using the person's
facts and opinions, scored 100% AI. Sourcing the ideas from a human does not
help. Only the sentences do.

**So: about one sentence in eight may be yours. That is enough for joins and
transitions. It is not enough for a section.**

## What this skill will not do

It will not make model-written prose read as human. Style profiles, humaniser
passes and register-matching have all been measured and they all make it worse,
not better. If asked for one, say so once and offer this instead.

It is not a detection-evasion tool. It produces writing that genuinely is the
author's, because they said it.

## Step 1 — Get their words

They need roughly **1.3x their target word count** in spoken material. About
75% of what someone says survives the cut. A 1,500-word article needs around
2,000 spoken words, which is 11 to 13 minutes of talking.

Three ways in. Offer whichever fits.

**A. Record now.** Best quality. Ask them to talk through the piece as if
explaining it to one person. Give them the section list first so they cover
everything, then get out of the way.

**B. Paste a transcript.** They already have a video, podcast, voice note or
webinar on the topic. Any of it works.

**C. Dictate into the chat.** Phone keyboard mic, or Google Docs > Tools >
Voice typing on desktop, which is free and has no length limit. Works in
Chrome, Edge and Safari, not Firefox.

If they have existing videos, ask for the transcripts of the ones on this
topic. Old *written* work does not count — it can only teach you to imitate,
which is the failure mode above.

**Do not proceed without enough material.** If they give you 400 spoken words
for a 1,500-word article, say so and ask for more. Filling the gap yourself is
exactly what produces a 100% AI verdict.

## Step 2 — Do not clean the transcript

The disfluency, the repetition, the odd constructions and the false starts are
the signal. Never run a transcript through a "tidy this up" pass. That single
step converts their prose into model prose before you have started.

## Step 3 — Plan, do not write

Return a plan, not paragraphs:

- Section order, and which chunk of transcript belongs in each
- Headings, which are yours to write. Signposting is not voice.
- What to cut and why
- What is missing, as questions for them to answer in another recording

No body text at this stage. None.

## Step 3.5 — Ask for what is missing

The plan will expose gaps. Do not fill them yourself. Ask.

Give them a short numbered list, five questions maximum, each aimed at one
specific hole. Good questions force something only they have:

1. **A number.** "You said it saved time. How much, on what?"
2. **A moment.** "Walk me through the first time it broke."
3. **A failure.** "What did you try before this that did not work?"
4. **An opinion they would defend.** "What do people get wrong about this?"
5. **The objection.** "Why would someone sensible disagree?"

Then say this plainly: **answer them out loud, in the same recording or a new
one, and paste the raw transcript.** Not typed. Typed answers drift into
written register and lose the thing this whole method depends on.

Append their answers to the original transcript. They are now source material
and get cut exactly like the rest.

If they answer by typing anyway, use it, but tell them those sections will read
differently from the spoken parts.

**Never answer your own question.** If a gap stays open after asking, either
cut that section from the plan or leave it as a visible gap in the draft. A gap
they can see is fixable. A gap you filled is a failure they cannot see.

## Step 4 — Edit by deletion

The transcript is the draft. The work is subtractive.

**Allowed:** cut, reorder, join two of their fragments, split a run-on into
paragraphs, fix what speech-to-text misheard (names, technical terms,
homophones), add headings.

**Not allowed:** rewriting a sentence they said into a better sentence,
composing a sentence to make their point more elegantly, smoothing an odd
construction, inventing any fact, number, quote or anecdote.

The oddness is the voice. Leave it.

Where a cut leaves a genuine gap, add the shortest possible bridge and flag it
so they can replace it in their own words.

## Step 5 — Check it

If they have Python, `trace.py` ships with this skill:

```
python3 trace.py draft.md transcript.txt
```

It classifies every sentence against the transcript and fails the draft below
85% their words, listing each composed sentence.

**If they cannot run Python**, do it as a check instead. Go through the draft
sentence by sentence against the transcript and list every sentence you cannot
point to a source for. Quote the transcript line beside each one you can. If
you cannot quote it, you wrote it. Count those words as a percentage of the
whole and report the number honestly.

Below 85%, cut the composed sentences rather than improving them.

## Step 6 — Hand it back

Give them:

1. The draft.
2. Every sentence you composed, listed, for them to retype in their own words.
   Do not offer to improve those. Retyping them is the point.
3. Two or three places where a detail only they have would strengthen it.

## Honest limits

- This predicts a detector's verdict, it does not guarantee one. Genuinely
  human writing is misclassified sometimes, and detectors misfire hardest on
  non-native English speakers, autistic writers and formulaic genres.
- It only works for people willing to talk. No recording means no human
  sentences, and nothing invents them.
- You can only write about what they have recorded.
- Keep the recording, the raw transcript and the draft history. Provenance is
  worth more than any score if authorship is ever questioned.
