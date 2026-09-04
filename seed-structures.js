/* Hardcoded canonical Headline Structure library — the source of truth.
 *
 * Shared, read-only data. Loaded by storage.js on every call (never from
 * localStorage), exactly like seed-topics.js / seed-scenes.js.
 *
 * Each structure is a full SPECIFICATION of a copywriting mechanism — NOT a
 * fill-in-the-blanks template. Fields:
 *   id, n            — identity + ordinal (1..28)
 *   type             — "headline"
 *   structure        — the recognizable shape of the headline
 *   mechanismName    — the psychological / copywriting mechanism
 *   coreMechanism    — the move the headline makes; what happens in the reader's head
 *   requiredInsight  — the exact thought the headline must trigger (pass/fail)
 *   mustPreserve     — structurally non-negotiable: locked wording, mandatory
 *                      quotation marks, required elements, exact syntax / parallelism,
 *                      fixed clauses
 *   canChange        — the writer's creative space
 *   forbidden        — automatic disqualifiers, incl. rules that keep this structure
 *                      distinct from adjacent structures
 *   examples         — the acceptable range (mechanism references, NOT wording to copy)
 *   disclaimer       — "Actor Portrayal" for testimonial structures, else null
 *
 * storage.js normalizeHeadlineStructure() derives title / example / content from
 * these and passes the full spec block to Workflow A as {{structure.content}}.
 */
window.SEED_STRUCTURES = [
  {
    id: "seed-structure-01",
    n: 1,
    type: "headline",
    structure: "NEVER AND I MEAN NEVER + [locked filler action]",
    mechanismName:
      'Prohibition with emphasis — the double "never" creates the feeling that you are breaking an important rule.',
    coreMechanism:
      "The listener recognizes themselves in the forbidden action and feels shame + curiosity simultaneously.",
    requiredInsight: '"I do this. Why is it bad? What should I do instead?"',
    mustPreserve: '"Never, and I mean never" — verbatim, without changes.',
    canChange: "Forbidden action (X), context (interview / event / meeting), who is speaking.",
    forbidden:
      'Do not soften the prohibition ("try not to" / "avoid"). Without the double never, the structure does not work.',
    examples: [
      "Never, and I mean never, introduce yourself by saying your name.",
      'Never, and I mean never, open a salary negotiation with "I was thinking maybe around—"',
      'Never, and I mean never, end a boardroom pitch with "does that make sense?"',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-02",
    n: 2,
    type: "headline",
    structure:
      "NEVER AND I MEAN NEVER + [consequence] + [wealthy families / CEO insider reveal] + [CTA: watch this]",
    mechanismName:
      'Prohibition + insider — the double prohibition is amplified by status authority ("wealthy families know something you don\'t").',
    coreMechanism:
      "Curiosity gap — there is secret knowledge you missed because of your background.",
    requiredInsight:
      '"There is an entire class of people who know something nobody told me."',
    mustPreserve:
      '"Never, and I mean never" + insider reveal (wealthy families / CEOs / executives) + "watch this" or "now it\'s public."',
    canChange:
      "Specific forbidden action, insider group (wealthy / old-money / Ivy League / executives), consequence.",
    forbidden: `Without the insider reveal this becomes Structure 1.
The insider group must be specific — not "successful people" but "wealthy families" / "CEOs."`,
    examples: [
      "Never, and I mean never, introduce yourself by saying your name. If your name is the first thing out of your mouth, you already lost your first impression. Wealthy families have known this for generations — now it's finally public.",
      'Never, and I mean never, open a meeting with "thank you for your time." CEOs are coached to do the opposite — now you know why.',
      'Never, and I mean never, answer "tell me about yourself" with your résumé. Ivy League career offices have drilled the alternative for years — here it is.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-03",
    n: 3,
    type: "headline",
    structure: "NUMBER + [category] + MISTAKES/SIGNS/PHRASES + THAT + [negative outcome]",
    mechanismName:
      "Numbered diagnostic — a concrete number creates the feeling that there is a complete list of your mistakes.",
    coreMechanism:
      '"I do one of these N things and don\'t know which one" — makes the viewer want to keep watching.',
    requiredInsight: '"How many of these am I doing right now?"',
    mustPreserve:
      "Concrete number (3/5/7) + negative outcome that sounds like a real pain.",
    canChange:
      "Number, noun (mistakes / signs / phrases / habits / red flags), category (small talk / interview / meeting), outcome.",
    forbidden: `Generic outcome ("that hurt you"). It must be specific ("that hurt your reputation at work" / "that make executives forget you").
Without specificity the structure becomes clickbait without punch.`,
    examples: [
      "3 Small Talk Mistakes That Hurt Your Reputation.",
      "5 Phrases That Make Senior Leaders Forget You in 8 Seconds.",
      "3 Signs Your Articulation Is Costing You Every Promotion.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-04",
    n: 4,
    type: "headline",
    structure: "I'M BEGGING YOU + STOP SAYING + [kill list of 3 locked filler phrases]",
    mechanismName:
      'Emotional plea + kill list — "begging" lowers the speaker\'s authority to the level of a friend who genuinely cares.',
    coreMechanism:
      "The listener sees their own phrases in the list and feels embarrassment + recognition simultaneously.",
    requiredInsight: '"I say at least one of these phrases every day."',
    mustPreserve:
      '"I\'m begging you" verbatim + minimum 2–3 concrete locked phrases in quotation marks.',
    canChange: "Phrase list, context (work / interview / dating / networking).",
    forbidden:
      'Generic phrases without quotation marks ("stop being vague"). The phrases must be word-for-word recognizable. Without quotation marks the recognition moment is lost.',
    examples: [
      'I\'m begging you, stop saying "I\'m fine, thank you" / "Nice to see you" / "What do you do?"',
      'I\'m begging you, stop saying "sorry, quick thought" / "I could be wrong, but" / "does that make sense?"',
      'I\'m begging you, stop saying "I\'m a hard worker" / "I\'m passionate about growth" / "I\'m a team player."',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-05",
    n: 5,
    type: "headline",
    structure: "NUMBER + PHRASES + THAT + [negative social outcome + intensity modifier]",
    mechanismName:
      'Numbered consequence — the number creates completeness, while the intensity modifier ("10X" / "instantly" / "quietly") increases severity.',
    coreMechanism:
      '"There are specific words I say and they have a specific measurable effect on how people perceive me."',
    requiredInsight:
      '"I say these phrases and don\'t know what they\'re doing to my status."',
    mustPreserve: 'Number + "phrases" + specific negative social outcome.',
    canChange:
      "Number, intensity modifier, outcome (reputation / status / first impression / career).",
    forbidden: `Vague outcome ("that hurt you") without specifics.
"10X less" requires proof or should be softened to "instantly" / "quietly."`,
    examples: [
      "3 Phrases That Instantly Kill Your Reputation at Work.",
      "5 Phrases That Quietly Lower Your Status in Every Room.",
      "3 Phrases That Make Senior Leaders Stop Taking You Seriously.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-06",
    n: 6,
    type: "headline",
    structure: "NEVER AND I MEAN NEVER + SAY + [kill list of locked filler phrases]",
    mechanismName:
      "Prohibition + list — double never amplified by concrete examples in quotation marks.",
    coreMechanism:
      "The listener recognizes their own phrases + feels that they are violating an important rule.",
    requiredInsight:
      '"I say at least one of these phrases constantly. Why is that bad?"',
    mustPreserve: '"Never, and I mean never" + phrases in quotation marks word-for-word.',
    canChange: "Phrase list, context, number of phrases in list.",
    forbidden: `Phrases without quotation marks.
More than 4 phrases loses punch.
Do not replace concrete phrases with generic descriptions.`,
    examples: [
      'Never, and I mean never, say "does that make sense?" / "sorry, quick thought" / "is it okay if I—?"',
      'Never, and I mean never, say "I\'m a hard worker" / "I\'m passionate about growth" / "I work well under pressure."',
      'Never, and I mean never, say "nice to meet you too" / "how are you? good, and you?" / "big turnout."',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-07",
    n: 7,
    type: "headline",
    structure: "ONE [X] CHANGED HOW I [Y] FOREVER",
    mechanismName:
      "Singular transformation — one small thing changed everything. Provokes hope + curiosity.",
    coreMechanism:
      '"There is one specific thing I was missing and it completely changes the result."',
    requiredInsight: '"What is that one thing? I want to know."',
    mustPreserve: `"One" + "forever" — both words are critical.
"One" = accessible.
"Forever" = irreversible change.`,
    canChange:
      "X (sentence / phrase / habit / question / word), Y (introduce myself / present / negotiate / interview).",
    forbidden: `More than one thing destroys the mechanism.
"Changed things" instead of "changed how I [specific action]" is too vague.`,
    examples: [
      "One sentence changed how I introduce myself forever.",
      "One question changed how I open every negotiation forever.",
      "One habit changed how senior leaders respond to me forever.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-08",
    n: 8,
    type: "headline",
    structure: "THE MORE YOU [X], THE MORE YOU [negative Y] + HERE'S HOW TO [fix]",
    mechanismName:
      "Paradox reveal + fix — counter-intuitive truth: the more you do X (something that seems correct), the worse Y becomes.",
    coreMechanism:
      '"What I thought was helping is actually hurting me. And there is a fix."',
    requiredInsight:
      '"I do X thinking it\'s right. It turns out I\'m hurting myself."',
    mustPreserve: 'Paradox structure "the more X the more Y" + fix ("here\'s how to").',
    canChange: "X and Y, context, length of fix portion.",
    forbidden: `X and Y cannot be obvious ("the more you lie the more you lose trust").
The paradox must be counter-intuitive — something that seems correct actually causes harm.`,
    examples: [
      "The more you memorize your speech, the more you ruin your presentation.",
      "The more you try to fill the silence, the more awkward the conversation gets.",
      "The more you apologize before your idea, the less seriously they take it.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-09",
    n: 9,
    type: "headline",
    structure: "THEY [negative action] + THE SECOND YOU + [trigger behavior]",
    mechanismName:
      "Instant judgment reveal — the listener learns there is a specific moment after which the decision is already made.",
    coreMechanism:
      '"There is one specific trigger after which I\'ve already lost — and I didn\'t know."',
    requiredInsight:
      '"What is that moment for me? I want to know so I can avoid it."',
    mustPreserve: '"The second you" — exact moment, not "when you" or "if you."',
    canChange:
      'Who "they" are (recruiters / senior leaders / the room / your boss), negative action, trigger behavior.',
    forbidden: `Vague trigger ("when you seem nervous").
Must be specific observable behavior ("the second you say 'um, well'" / "the second you start with your name").`,
    examples: [
      'They decide you\'re not ready the second you open with "um, well—"',
      'They stop listening the second you say "does that make sense?"',
      'They forget you the second you say "nice to meet you too."',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-10",
    n: 10,
    type: "headline",
    structure: "HOW TO + [high-stakes action] + [target audience / context]",
    mechanismName:
      'Direct skill promise — "how to" promises a concrete skill for a specific audience.',
    coreMechanism:
      '"There is a specific technique for this specific moment and I\'m going to learn it."',
    requiredInsight: '"I want to know exactly this. For exactly this moment."',
    mustPreserve:
      'High-stakes action — not generic ("how to talk better") but specific ("how to present to senior leaders" / "how to introduce yourself in an interview").',
    canChange: "Action, target audience, context.",
    forbidden: `Generic action without context ("how to speak better").
Without target audience or specific context the structure becomes too broad.`,
    examples: [
      "How to present to senior leaders.",
      "How to introduce yourself in an interview without saying your name first.",
      "How to open a salary negotiation without undermining yourself.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-11",
    n: 11,
    type: "headline",
    structure:
      "[TIME + daily habit] + [age] + [timeframe started] + [career outcome] + I'M TELLING YOU + START [action] + [deadline CTA]",
    mechanismName:
      "Social proof testimonial with urgency — real person, real time, real result + direct advice with deadline.",
    coreMechanism: '"If they managed it, I can too. And I need to start now."',
    requiredInsight:
      '"This is a real person who started from zero and got a result. I need to start."',
    mustPreserve:
      '"I\'m telling you" + deadline CTA ("by [date] you\'ll thank me") + age + specific career outcome.',
    canChange: "Time (6:30am / lunch break), age, timeframe, outcome, deadline.",
    forbidden: `Outcome guarantee without Actor Portrayal disclaimer.
Without specific age and timeframe it loses authenticity.
Without deadline it loses urgency.`,
    examples: [
      "6:30 a.m. Training my articulation for 9 minutes before the office. I'm 47. Started four months ago. Got promoted to VP last week. I'm telling you, start working on your articulation. By July 10th, you'll thank me.",
      "Lunch break. 9 minutes of small talk drills. I'm 38. Started three months ago. My boss finally knows my name. I'm telling you, start now. By next month, you'll feel the difference.",
    ],
    disclaimer: "Actor Portrayal",
    seed: true,
  },
  {
    id: "seed-structure-12",
    n: 12,
    type: "headline",
    structure: "HOW TO + [high-stakes action] + IN + [specific context]",
    mechanismName:
      'Contextual skill promise — "how to" tied to a specific place or situation.',
    coreMechanism:
      '"There is a specific technique for this specific context. Not general — specifically for this."',
    requiredInsight: '"This exact situation is what I need. This exact context."',
    mustPreserve:
      '"In" + specific context — this distinguishes it from Structure 10.',
    canChange: "Action, context (interview / elevator / boardroom / networking event).",
    forbidden: `Generic context ("in conversations").
Must be specific setting ("in an interview" / "in the elevator with your CEO" / "in a salary negotiation").`,
    examples: [
      "How to introduce yourself in an interview.",
      "How to speak up in a meeting full of senior leaders.",
      'How to start a conversation at a networking event without defaulting to "what do you do?"',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-13",
    n: 13,
    type: "headline",
    structure: "[PROBLEM] + TURN + [positive identity] + INTO + [negative outcome identity]",
    mechanismName:
      "Identity threat — the problem doesn't simply hurt an outcome; it transforms a positive identity into a negative one.",
    coreMechanism:
      '"I see myself as X (smart / capable / prepared). But this problem makes me Y (invisible / skippable / silent)."',
    requiredInsight:
      '"I recognize myself in the positive identity. And I\'m afraid of the negative one."',
    mustPreserve: `Positive identity → negative outcome identity.
The contrast must be sharp.`,
    canChange: "Problem, positive identity, negative identity.",
    forbidden: `Both identities cannot be neutral.
The contrast must be sharp and painful — "smart people → silent underachievers", not "good employees → average workers."`,
    examples: [
      "Articulation issues turn smart people into silent underachievers.",
      "Bad small talk turns qualified candidates into forgettable ones.",
      '"Sorry, quick thought" turns good ideas into someone else\'s credit.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-14",
    n: 14,
    type: "headline",
    structure: "YOUR [X] GETS YOU [Y]. YOUR [Z] GETS YOU [W].",
    mechanismName:
      "Parallel contrast — two parallel sentences create the feeling that there are two levels of the game and you only know the first.",
    coreMechanism:
      '"There is what I know (CV / preparation / experience) and there is what actually decides the result (sentences / articulation / first impression)."',
    requiredInsight: '"I was focusing on X. But Z is what actually decides it."',
    mustPreserve:
      "Exact parallel structure — both sentences should have the same length and structure.",
    canChange:
      'X/Y/Z/W — but the contrast must be between "what everyone knows" and "what actually decides it."',
    forbidden: `Both sentences cannot be about the same thing.
The contrast must be between preparation and delivery, document and words, what is visible and what is heard.`,
    examples: [
      "Your résumé gets you in the room. Your sentences get you the job.",
      "Your preparation gets you to the pitch. Your articulation gets you the deal.",
      "Your experience gets you the interview. Your first sentence gets you the offer.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-15",
    n: 15,
    type: "headline",
    structure: "NUMBER + SIGNS + YOU'RE NOT A [aspirational identity] + [symptom list of 3]",
    mechanismName:
      "Negative self-diagnosis — the listener checks themselves against symptoms and discovers they have not achieved the desired identity.",
    coreMechanism:
      '"I thought I was X (well-spoken / charismatic / confident). But there are specific signs saying otherwise."',
    requiredInsight: '"Do I have these symptoms? I\'m checking now."',
    mustPreserve:
      'Aspirational identity in negative form ("you\'re NOT a well-spoken person") + concrete observable symptoms.',
    canChange: "Number, aspirational identity, symptoms.",
    forbidden: `Aspirational identity cannot be generic ("successful person").
Symptoms must be concrete observable behaviors — not feelings ("you feel nervous") but actions ("you lose your words mid-sentence").`,
    examples: [
      "3 Signs You're Not a Well-Spoken Person: You lose your words mid-sentence / You over-explain simple points / You end sentences like questions.",
      '3 Signs You\'re Not Ready for a Senior Role: You open with "sorry, quick thought" / You ramble under pressure / You blank on follow-up questions.',
      '5 Signs Your Small Talk Is Killing Your Career: You default to "what do you do" / You talk about the weather / Nobody follows up after events.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-16",
    n: 16,
    type: "headline",
    structure: "IMPERATIVE VERB + [negative experience to eliminate]",
    mechanismName:
      "Command + pain point — a short direct command promising to eliminate a specific painful experience.",
    coreMechanism: '"There is an experience I hate and there is a way to end it."',
    requiredInsight: '"Yes, I want this to end. How?"',
    mustPreserve:
      'Strong imperative verb + specific negative experience (not generic "bad conversations" but "awkward small talk" / "going blank mid-sentence").',
    canChange: "Verb (end / stop / kill / fix), negative experience.",
    forbidden: `Generic experience ("end bad conversations").
Must be specific and recognizable pain.`,
    examples: [
      "End awkward small talk.",
      "Stop going blank mid-sentence.",
      'Kill "sorry, quick thought" from every meeting.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-17",
    n: 17,
    type: "headline",
    structure: "THIS IS HOW + [self-label in quotes] + AT [skill] + IS COSTING YOU + [outcome]",
    mechanismName:
      'Self-label reframe — the person has a negative self-label ("I\'m bad at small talk") and discovers that this identity has a concrete cost.',
    coreMechanism:
      '"My self-label isn\'t just a description. It is actively costing me something."',
    requiredInsight:
      '"I say this about myself constantly. I didn\'t know it had this cost."',
    mustPreserve:
      'Self-label in quotation marks + "is costing you" + specific outcome.',
    canChange: "Self-label, skill, outcome.",
    forbidden: `Self-label without quotation marks — quotation marks are critical because they represent the listener's internal voice.
Outcome cannot be vague ("costing you happiness").`,
    examples: [
      'This is how "being bad at small talk" is costing you opportunities.',
      'This is how "being too nice" is costing you every promotion.',
      'This is how "not being a morning person" is costing you 90 minutes of your most productive time.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-18",
    n: 18,
    type: "headline",
    structure: "WHY + [positive identity] + ALWAYS FAIL AT + [skill]",
    mechanismName:
      "Paradox identity — a positive identity (smart / prepared / experienced) paradoxically fails at a specific skill.",
    coreMechanism:
      '"The exact thing that makes me X (smart) gets in my way at Y (small talk). I want to know why."',
    requiredInsight:
      '"I see myself as this positive identity. Why do I fail exactly here?"',
    mustPreserve: `"Always" — absoluteness strengthens the paradox.
Positive identity must genuinely be positive.`,
    canChange: "Positive identity, skill.",
    forbidden: `Negative identity ("why bad communicators always fail") destroys the paradox.
"Always" can be replaced with "often" but loses punch.`,
    examples: [
      "Why smart people always fail at small talk.",
      "Why prepared candidates always blank in interviews.",
      "Why hard workers always get passed over for promotion.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-19",
    n: 19,
    type: "headline",
    structure:
      "BEING THE + [identity label in quotes] + MAKES PEOPLE THINK YOU'RE + [negative perception]",
    mechanismName:
      "Identity-perception gap — a gap between how you identify yourself and how other people perceive you.",
    coreMechanism: '"I thought being X was good. But other people see me as Y."',
    requiredInsight: '"How do people actually see me? Not the way I thought."',
    mustPreserve:
      'Identity label in quotation marks + "makes people think you\'re" — specifically other people\'s perception, not fact.',
    canChange: "Identity label, negative perception.",
    forbidden: `Identity label without quotation marks — quotation marks show it is a self-label.
Negative perception cannot be obvious ("makes people think you're rude").
It should be a surprising gap ("makes people think you're incompetent" when you thought being "nice" was good).`,
    examples: [
      'Being the "nice girl" makes people think you\'re incompetent.',
      'Being "too polite" makes people think you\'re not leadership material.',
      'Being "the hard worker" makes people think you\'re not executive material.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-20",
    n: 20,
    type: "headline",
    structure:
      "IF YOU + [specific bad habit] + THE NEXT [X] SECONDS WILL CHANGE YOUR LIFE + [CTA: watch this]",
    mechanismName:
      "Conditional hook + urgency — if you have this specific symptom, what comes next is critically important right now.",
    coreMechanism: '"This content is specifically for me. It will affect me right now."',
    requiredInsight: '"This is about me. I need to keep watching."',
    mustPreserve:
      'Specific observable bad habit (not "if you struggle") + "the next X seconds" + "watch this."',
    canChange: "Bad habit, number of seconds (30 / 60 / 90).",
    forbidden: `Generic bad habit ("if you're bad at communication").
Must be a specific moment ("if you start every interview answer with 'um, well—'" / "if your mind goes blank the second someone asks").
Without "watch this" or equivalent CTA, urgency is lost.`,
    examples: [
      'If you start every interview answer with "um, well—" — the next 30 seconds will change your life. Watch this.',
      "If your mind goes blank the second someone puts you on the spot — the next 30 seconds will change your life. Watch this.",
      "If you leave every meeting replaying what you should have said — the next 60 seconds will change your life. Watch this.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-21",
    n: 21,
    type: "headline",
    structure:
      "STOP SPEAKING LIKE [negative identity]. START SPEAKING LIKE [aspirational identity].",
    mechanismName:
      "Identity pivot — direct command to replace one identity with another through the way you speak.",
    coreMechanism:
      '"The way I speak determines what identity people assign to me. I can change the identity by changing my language."',
    requiredInsight:
      '"I speak like the first identity. I want to speak like the second."',
    mustPreserve:
      "Exact parallel STOP/START structure + both identities must be vivid and contrasting.",
    canChange:
      "Negative and aspirational identities, context (at work / in interviews / in negotiations).",
    forbidden: `Generic identities ("stop speaking like a junior. start speaking like a leader").
Identities must be specific and vivid ("nice girl" / "someone they can't ignore").`,
    examples: [
      "Stop speaking like a 'nice girl' at work. Start speaking like someone they can't ignore.",
      "Stop speaking like a candidate. Start speaking like the hire.",
      "Stop speaking like you're asking permission. Start speaking like you already have it.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-22",
    n: 22,
    type: "headline",
    structure:
      "YOU'LL NEVER [positive outcome] + INTO [specific stakes-bearing room/context] + YOU SOUND LIKE YOU DON'T BELONG IN",
    mechanismName: `Sound = belonging — how you sound determines which room you get into.
Not experience, not CV — sound.`,
    coreMechanism:
      '"There are rooms I want to enter. My voice / language determines whether I get there."',
    requiredInsight:
      '"How do I sound in these rooms? Do I sound like someone who belongs there?"',
    mustPreserve: `"You sound like you don't belong in" — verbatim, every time. This is the mechanism (sound
determines access), so the payoff clause never changes shape.
The word "sound" itself — never "look" or "act." (Also listed under FORBIDDEN — it's the one word
in this structure that is genuinely non-negotiable.)
Note what is NOT locked: the reference examples below use "a room," "a team," and "a room" — three
different container nouns across three examples. The container was never the fixed part; the payoff
clause was. Treat the container as fully open (see CAN CHANGE).`,
    canChange: `Two independent things, and real diversity needs both to move together:
1. The access outcome / verb (promoted, hired, invited, trusted, handed, kept in the loop, believed,
backed, chosen, taken seriously — whatever this topic's version of "let in" is).
2. The room or context itself — and this is where the actual insight has to live. Make it a specific,
stakes-bearing situation tied to the topic (the meeting where the budget gets signed off, the call
where the client decides, the table where they pick who leads the launch) rather than a generic
container label (a room / a team / a meeting) that just relabels the same idea in different words.
Ten headlines should name ten different concrete stakes, not ten synonyms for "an important room."`,
    forbidden: `Do not replace "sound like" with "look like" or "act like."
"Sound" is the key word because this is an articulation product.
Do not just swap one generic container noun for another (room → team → group → meeting) while the
rest of the sentence stays the same idea — that is a synonym swap, not a different insight. If two
headlines would still make sense with their containers swapped, one of them isn't naming a real,
specific stake and has to be rebuilt.`,
    examples: [
      "You'll never be promoted into a room you sound like you don't belong in.",
      "You'll never be hired into a team you sound like you don't belong in.",
      "You'll never be invited back into a room you sound like you don't belong in.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-23",
    n: 23,
    type: "headline",
    structure: "RICH PEOPLE / WEALTHY FAMILIES + DON'T + [locked filler action]",
    mechanismName:
      "Status behavior reveal — there is a specific action high-status people do not do and you do.",
    coreMechanism:
      '"There is a behavioral status marker I didn\'t know about, and it is connected to language."',
    requiredInsight: '"What do they do instead? Why does this matter?"',
    mustPreserve: `"Rich people" or "wealthy families" — specific status group.
"Don't" — prohibition through behavior, not through a rule.`,
    canChange:
      "Status group (rich people / wealthy families / old-money families / executives), filler action.",
    forbidden: `Generic status group ("successful people / high achievers").
Must be a specific aspirational group with clear cultural meaning.`,
    examples: [
      "Rich people don't introduce themselves with their name.",
      'Wealthy families don\'t answer "how are you" with "I\'m fine."',
      'Rich people don\'t end presentations with "does that make sense?"',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-24",
    n: 24,
    type: "headline",
    structure:
      "THE [X] THAT DECIDES EVERYTHING + [specific trigger question] + IF YOU [bad behavior] + YOU'RE DONE",
    mechanismName:
      "Single decisive moment — there is one moment that decides everything and one specific behavior that kills it.",
    coreMechanism:
      '"There is one moment after which everything is decided. And I may already have missed it."',
    requiredInsight:
      '"What is this moment for me? I want to know so I don\'t screw it up."',
    mustPreserve: `"Decides everything" + "you're done" — both create finality.
Specific trigger question in quotation marks.`,
    canChange: "X (question / moment / sentence / opening), trigger, bad behavior.",
    forbidden: `Vague trigger without quotation marks.
"You're done" cannot be softened — finality is the mechanism.`,
    examples: [
      'The interview question that decides everything: "Can you walk us through your experience?" If you start rambling or freeze mid-sentence — you\'re done.',
      "The networking moment that decides everything: the first 8 seconds. If you open with your name — you're done.",
      'The meeting moment that decides everything: when your boss asks for your opinion. If you open with "sorry, quick thought" — you\'re done.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-25",
    n: 25,
    type: "headline",
    structure: "MAKE IT A HABIT + [product spec] + UNTIL [specific deadline]",
    mechanismName:
      "Habit formation + deadline urgency — a concrete habit with a concrete deadline creates the feeling that you need to start now.",
    coreMechanism:
      '"There is a specific habit with a specific timeframe and specific date after which it will be too late."',
    requiredInsight: '"This is concrete. This is feasible. I need to start."',
    mustPreserve:
      '"Make it a habit" + specific product spec (9 minutes / articulation training) + specific deadline date.',
    canChange: "Deadline, product spec details.",
    forbidden: `Generic deadline ("soon" / "this year").
Deadline must be a specific date.
Without product spec it becomes a generic motivational quote.`,
    examples: [
      "Make it a habit: 9 minutes of articulation training until April 28th.",
      "Make it a habit: 9 minutes of small talk drills until the end of the month.",
      "Make it a habit: 9 minutes of RiseGuide every morning until your next interview.",
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-26",
    n: 26,
    type: "headline",
    structure:
      "[THIRD PARTY] SAYS I'VE BECOME [aspirational identity] SINCE I STARTED [product action]",
    mechanismName:
      "Third-party validation testimonial — the change is confirmed by someone else, not by the person themselves. More credible than self-report.",
    coreMechanism:
      '"The change is noticeable enough that other people see it. Not me — them."',
    requiredInsight:
      '"If even people close to me see the difference, the change is real."',
    mustPreserve:
      'Third party (husband / boss / colleague / friend) + aspirational identity + "since I started."',
    canChange: "Third party, aspirational identity, product action.",
    forbidden: `Self-report ("I became") destroys third-party validation.
Aspirational identity cannot be vague ("better").
It must be specific ("the most interesting person in the room" / "the one they always ask for opinion").`,
    examples: [
      "My husband says I've become the most interesting woman in the room since I started working on my articulation.",
      "My boss says I've become someone she actually listens to since I started RiseGuide.",
      "My team says I've become the person who always knows what to say since I started small talk training.",
    ],
    disclaimer: "Actor Portrayal",
    seed: true,
  },
  {
    id: "seed-structure-27",
    n: 27,
    type: "headline",
    structure:
      "IF YOU + [symptom] — YOU DON'T HAVE A [wrong diagnosis]. YOU HAVE AN ARTICULATION PROBLEM.",
    mechanismName:
      "Reframe diagnosis — the listener has the wrong diagnosis of their problem and learns the correct one.",
    coreMechanism:
      '"I thought my problem was X (nerves / confidence / personality). Actually it is articulation. And that is fixable."',
    requiredInsight:
      '"I always thought the problem was X. But if it is articulation, I can fix it."',
    mustPreserve:
      'Specific symptom + wrong diagnosis (confidence / nerves / personality / intelligence) + "articulation problem" as the correct diagnosis.',
    canChange: "Symptom, wrong diagnosis.",
    forbidden: `Wrong diagnosis cannot be medical ("ADHD" — compliance risk).
Symptom must be specific and observable — not "if you feel nervous" but "if you leave every meeting replaying what you should have said."`,
    examples: [
      "If you leave every meeting replaying what you should have said — you don't have a confidence problem. You have an articulation problem.",
      "If you freeze the moment someone puts you on the spot — you don't have an anxiety problem. You have an articulation problem.",
      'If you keep getting "we went with someone else" — you don\'t have a qualification problem. You have an articulation problem.',
    ],
    disclaimer: null,
    seed: true,
  },
  {
    id: "seed-structure-28",
    n: 28,
    type: "headline",
    structure: "I'M BEGGING YOU — STOP [bad habit]. START [correct action]. [MECHANISM WHY.]",
    mechanismName:
      'Emotional plea + stop/start + mechanism — "begging" lowers authority to the level of a friend, stop/start gives a concrete replacement, and the mechanism explains why.',
    coreMechanism:
      '"There is a specific bad habit, a specific replacement, and a reason why the replacement works."',
    requiredInsight:
      '"I do this. There is a concrete replacement. And now I understand why it works."',
    mustPreserve:
      '"I\'m begging you" + stop/start pair + mechanism sentence (one sentence explaining why).',
    canChange: "Bad habit, correct action, mechanism.",
    forbidden: `Without the mechanism it becomes Structure 4.
The mechanism must explain WHY — not simply repeat the stop/start in different words.`,
    examples: [
      "I'm begging you — stop practicing your answers in your head. Start training real-time articulation. Your mouth has never heard the answer.",
      "I'm begging you — stop opening with your name. Start with a question. Your name is the one thing they already have.",
      'I\'m begging you — stop saying "does that make sense?" Start landing the point. The moment you ask for permission, you\'ve undone everything you just said.',
    ],
    disclaimer: null,
    seed: true,
  },
];
