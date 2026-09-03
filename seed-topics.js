/* Hardcoded starter Topics — the Headline Lab topic library.
 *
 * These are copied into localStorage on first run (see storage.js). After that
 * they behave like any other Topic: editable and deletable. Editing a seed
 * Topic changes only the stored copy, never this file.
 *
 * Each entry: id, name, description (What we sell + Problem), pains[] (core
 * pain(s), in the audience's words), reframe (core reframe). The `seed: true`
 * flag drives the small "starter" label in the UI. createdAt / updatedAt are
 * filled in by storage.js when the seeds are first written.
 */
window.SEED_TOPICS = [
  {
    id: "seed-respect",
    seed: true,
    name: "Respect",
    description: `What we sell:
RiseGuide as a tool that changes how people are perceived — not through appearance or job title, but through how they speak.

Problem:
People do everything right — work, prepare, know the material — but people don't listen, interrupt them, ignore their ideas. They don't understand why. The answer is not what they say, but how they say it.`,
    pains: ["I said it. Nobody reacted. He said the same thing. The room stopped."],
    reframe: "Respect isn't earned by working harder. It's signaled in the first sentence.",
  },
  {
    id: "seed-first-impression",
    seed: true,
    name: "First impression",
    description: `What we sell:
RiseGuide as first-sentence training — what comes out of your mouth in the first 8 seconds.

Problem:
People open with "Hi, I'm..." / "nice to meet you too" / "so, what do you do?" and become one of forty. The room doesn't remember them.`,
    pains: ["I meet people. They never remember me."],
    reframe:
      "Your name is not an introduction. It's an ID check. The first impression is made in the question you ask — not the name you give.",
  },
  {
    id: "seed-career",
    seed: true,
    name: "Career",
    description: `What we sell:
RiseGuide as a career tool for people stuck at one level not because they lack experience, but because of an articulation gap.

Problem:
Competent, experienced people prepare, but a colleague with less experience gets the promotion, credit for the idea, CEO attention. The answer is articulation gap.`,
    pains: ["Same idea. Different sentence. He got promoted. I got a thank-you email."],
    reframe:
      "You don't get promoted for what you know. You get promoted for how you sound saying it.",
  },
  {
    id: "seed-job-seekers",
    seed: true,
    name: "Job seekers",
    description: `What we sell:
RiseGuide as interview-prep training focused on drilling articulation under pressure, not memorizing answers.

Problem:
Strong CV, weeks of preparation, then blank / rambling / CV recital in the interview. Ends with "we'll be in touch."`,
    pains: ["34 rejections. My CV is strong. I still don't know why I keep losing."],
    reframe:
      "Your résumé got you in the room. Your sentences get you the job. Qualified isn't hired. Articulate is.",
  },
  {
    id: "seed-silent-underachievers",
    seed: true,
    name: "Silent underachievers",
    description: `What we sell:
RiseGuide as a tool for people who know the answer but cannot say it because of an articulation gap.

Problem:
Smart, prepared people freeze under pressure. Mind goes blank. Later they think of the perfect answer in the car. For years.`,
    pains: [
      "I knew exactly what to say. I said nothing. Again.",
      "I leave every meeting replaying what I should have said.",
    ],
    reframe:
      "Knowing and saying are two different skills. You only trained one. Pressure erases scripts. It doesn't erase drilled reflexes.",
  },
  {
    id: "seed-nice-girl-good-boy",
    seed: true,
    name: "Nice girl / good boy",
    description: `What we sell:
RiseGuide as a tool for people everyone likes but nobody promotes because their language signals "optional" instead of "essential."

Problem:
Polite, team players, never confrontational — and therefore stuck. Ideas are softened to death. They apologize before every question. HR says "great attitude" but doesn't promote them.`,
    pains: [
      "I'm everyone's favorite. And nobody's choice.",
      '"She\'s so sweet." = She stays where she is.',
    ],
    reframe:
      "Nice isn't kind. It's invisible. 'Sorry, quick thought' is not politeness. It's a signal that your idea is optional.",
  },
  {
    id: "seed-public-speaking",
    seed: true,
    name: "Public speaking / presentations",
    description: `What we sell:
RiseGuide as a presentation drill tool for people who memorize and then blank, ramble, or lose the room after the first sentence.

Problem:
Hours of preparation — slides, notes, rehearsal — and still get "send us the deck offline." Or blank on the first question. Or say "does that make sense?" at the end and undo everything.`,
    pains: [
      "I rehearsed for three weeks. I froze on slide four.",
      "They said 'send me the deck offline.' Again.",
    ],
    reframe:
      "Memorization protects nothing. Reps do. The boardroom isn't testing your slides. It's testing your first sentence.",
  },
  {
    id: "seed-small-talk",
    seed: true,
    name: "Small talk",
    description: `What we sell:
RiseGuide as a small-talk drill tool for people who default to "big line huh" / "nice weather" / "so what do you do?" and remain invisible at every event.

Problem:
Networking event, dinner, party — either stand in the corner or do autopilot small talk nobody remembers. Leave with no new contacts.`,
    pains: [
      "I go to every event. I leave knowing nobody new.",
      "I said 'nice to meet you too.' She won't remember me tomorrow.",
    ],
    reframe:
      "Small talk isn't filling silence. It's reading the room. The question you ask in the first 8 seconds decides if they remember you by Monday.",
  },
];
