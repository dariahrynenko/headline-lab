/* Hardcoded canonical Structure library — the Headline Lab structure/pattern set.
 *
 * Shared, read-only data. Loaded by storage.js on every call (never from
 * localStorage), exactly like seed-topics.js: every user sees the same set and
 * a redeployed copy of this file reaches everyone.
 *
 * Each entry: id, pattern (the structural/rhetorical framework), example (the
 * winning example headline). storage.js also derives `title` and `content` from
 * these for the existing list/detail/generator UI, and sets `seed: true`.
 */
window.SEED_STRUCTURES = [
  {
    id: "seed-structure-01",
    pattern: "NEVER AND I MEAN NEVER + [locked filler action]",
    example: "Never, I mean never, introduce yourself by saying your name.",
  },
  {
    id: "seed-structure-02",
    pattern:
      "NEVER AND I MEAN NEVER + [consequence] + [wealthy families / CEO insider reveal] + [CTA: watch this]",
    example:
      "Never, I mean never, introduce yourself by saying your name. If your name is the first thing out of your mouth, you already lost your first impression. Wealthy families have known these secrets for generations — now it's finally public, so watch this.",
  },
  {
    id: "seed-structure-03",
    pattern: "NUMBER + [category] + MISTAKES/SIGNS/PHRASES + THAT + [negative outcome]",
    example: "3 Small Talk Mistakes That Hurt Your Reputation",
  },
  {
    id: "seed-structure-04",
    pattern: "I'M BEGGING YOU + STOP SAYING + [kill list of 3 locked filler phrases]",
    example:
      'I\'m begging you, stop saying "I\'m fine, thank you" / "Nice to see you" / "What do you do?"',
  },
  {
    id: "seed-structure-05",
    pattern: "NUMBER + PHRASES + THAT + [negative social outcome + intensity modifier]",
    example: "3 Phrases That Make People Respect You 10X Less",
  },
  {
    id: "seed-structure-06",
    pattern: "NEVER AND I MEAN NEVER + SAY + [kill list of locked filler phrases]",
    example:
      'Never, and I mean never, say "Does that make sense?" / "Sorry, can I just add one thing?" / "Is it okay if I...?"',
  },
  {
    id: "seed-structure-07",
    pattern: "ONE [X] CHANGED HOW I [Y] FOREVER",
    example: "One Sentence Changed How I Introduce Myself Forever",
  },
  {
    id: "seed-structure-08",
    pattern: "THE MORE YOU [X], THE MORE YOU [negative Y] + HERE'S HOW TO [fix]",
    example:
      "The More You Memorize Your Speech, The More You Ruin Your Presentation. Here's How to Train Real-Time Articulation.",
  },
  {
    id: "seed-structure-09",
    pattern: "THEY [negative action] + THE SECOND YOU + [trigger behavior]",
    example: "They Judge You the Second You Say This Phrase",
  },
  {
    id: "seed-structure-10",
    pattern: "HOW TO + [high-stakes action] + [target audience]",
    example: "How to Present to Senior Leaders",
  },
  {
    id: "seed-structure-11",
    pattern:
      "[TIME + daily habit] + [age] + [timeframe started] + [career outcome] + I'M TELLING YOU + START [action] + [deadline CTA]",
    example:
      "6:30 a.m. Training my articulation for 9 minutes. I'm 47. Started four months ago. Got promoted to VP last week. I'm telling you, start working on your articulation. By July 10th, you'll thank me.",
  },
  {
    id: "seed-structure-12",
    pattern: "HOW TO + [high-stakes action] + IN + [specific context]",
    example: "How to Introduce Yourself in an Interview",
  },
  {
    id: "seed-structure-13",
    pattern: "[PROBLEM] + TURN + [positive identity] + INTO + [negative outcome identity]",
    example: "Articulation Issues Turn Smart People Into Silent Underachievers",
  },
  {
    id: "seed-structure-14",
    pattern: "YOUR [X] GETS YOU [Y]. YOUR [Z] GETS YOU [W].",
    example: "Your Résumé Gets You in the Room. Your Sentences Get You the Job.",
  },
  {
    id: "seed-structure-15",
    pattern: "NUMBER + SIGNS + YOU'RE NOT A [aspirational identity] + [symptom list of 3]",
    example:
      "3 Signs You're Not a Well-Spoken Person: You lose your words mid-sentence / You cut people off / You provide unnecessary details",
  },
  {
    id: "seed-structure-16",
    pattern: "IMPERATIVE VERB + [negative experience you want to eliminate]",
    example: "End Awkward Small Talk",
  },
  {
    id: "seed-structure-17",
    pattern: "THIS IS HOW + [self-label in quotes] + AT [skill] + IS COSTING YOU + [outcome]",
    example: 'This Is How "Being Bad" at Small Talk Is Costing You Opportunities',
  },
  {
    id: "seed-structure-18",
    pattern: "WHY + [positive identity] + ALWAYS FAIL AT + [skill]",
    example: "Why Smart People Always Fail at Small Talk",
  },
  {
    id: "seed-structure-19",
    pattern:
      "BEING THE + [identity label in quotes] + MAKES PEOPLE THINK YOU'RE + [negative perception]",
    example: 'Being the "Nice Girl" Makes People Think You\'re Incompetent',
  },
  {
    id: "seed-structure-20",
    pattern:
      "IF YOU + [specific bad habit] + THE NEXT [X] SECONDS WILL CHANGE YOUR LIFE + [CTA: watch this]",
    example:
      'If you start every interview answer with "um, well —" — the next 30 seconds will change your life. Watch this.',
  },
  {
    id: "seed-structure-21",
    pattern: "STOP SPEAKING LIKE [negative identity]. START SPEAKING LIKE [aspirational identity].",
    example:
      "Stop Speaking Like a 'Nice Girl' at Work. Start Speaking Like Someone They Can't Ignore.",
  },
  {
    id: "seed-structure-22",
    pattern:
      "YOU'LL NEVER [positive outcome] + INTO A ROOM + YOU SOUND LIKE YOU DON'T BELONG IN",
    example: "You'll Never Be Promoted Into a Room You Sound Like You Don't Belong In.",
  },
  {
    id: "seed-structure-23",
    pattern: "RICH PEOPLE / WEALTHY FAMILIES + DON'T + [locked filler action]",
    example: "Rich People Don't Introduce Themselves With Their Name.",
  },
  {
    id: "seed-structure-24",
    pattern:
      "THE [X] THAT DECIDES EVERYTHING + [specific trigger question] + IF YOU [bad behavior] + YOU'RE DONE",
    example:
      'The Interview Question That Decides Everything: "Can you walk us through your experience?" If you start rambling or freeze mid-sentence… you\'re done.',
  },
  {
    id: "seed-structure-25",
    pattern: "MAKE IT A HABIT + [product spec] + UNTIL [specific deadline]",
    example: "Make It a Habit: 9 Minutes of Articulation Training Until April 28th",
  },
  {
    id: "seed-structure-26",
    pattern:
      "[THIRD PARTY] SAYS I'VE BECOME [aspirational identity] SINCE I STARTED [product action]",
    example:
      "My Husband Says I've Become the Most Interesting Woman in the Room Since I Started Working on My Communication Skills.",
  },
  {
    id: "seed-structure-27",
    pattern:
      "IF YOU + [symptom] — YOU DON'T HAVE A [wrong diagnosis] PROBLEM. YOU HAVE AN ARTICULATION PROBLEM.",
    example:
      "If You Leave Every Meeting Replaying What You Should Have Said — You Don't Have a Confidence Problem. You Have an Articulation Problem.",
  },
  {
    id: "seed-structure-28",
    pattern: "I'M BEGGING YOU — STOP [bad habit]. START [correct action]. [MECHANISM WHY.]",
    example:
      "I'm Begging You — Stop Practicing Your Answers in Your Head. Start Training Real-Time Articulation. Your Mouth Has Never Heard the Answer.",
  },
];
