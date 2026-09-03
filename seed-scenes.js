/* Hardcoded canonical Scene structure library.
 *
 * Shared, read-only data. Loaded by storage.js on every call (never from
 * localStorage), exactly like seed-structures.js. Each entry follows the same
 * shape as a headline structure, plus an explicit type:
 *
 *   { id: "seed-scene-01", type: "scene", pattern: "…", example: "…" }
 *
 * storage.js derives `title` and `content` from pattern/example and sets
 * `seed: true`, so the existing Structures list/detail/generator UI renders
 * scenes with no further architecture changes.
 *
 * `pattern` is the reusable structural blueprint (the beat sequence and
 * mechanics). `example` is the winning reference scene used as structural
 * guidance for the generator — never copied verbatim.
 */
window.SEED_SCENES = [
  {
    id: "seed-scene-01",
    type: "scene",
    pattern:
      '[PERSON approaches VIP with weak opener] + [VIP: "you need small talk training"] + [2nd attempt: "same energy"] + [cost: "one chance / ninety seconds"] + [product reveal] + [tattooable close + walk away]',
    example: `PERSON 1: Hey — sorry to interrupt — huge fan of your work.
PERSON 2: Thank you.
PERSON 1: So …how have you been finding the conference?
PERSON 2: …you need small talk training.
PERSON 1: I'm just trying to introduce myself.
PERSON 2: That's the worst opener at an event like this. I can answer that question with one word and forget this conversation ever happened.
PERSON 1: …fair.
PERSON 2: Try again.
PERSON 1: …so — have you talked to anyone exciting today?
PERSON 2: Same energy.
PERSON 1: …I don't know what else to ask.
PERSON 2: That's the problem. This is the one chance you get to talk to me. And you spent it asking questions nobody wants to answer.
PERSON 1: …how do I fix this?
PERSON 2: RiseGuide. Articulation training. 9 minutes a day. 28 days. Next time someone hands you ninety seconds with the right person, you won't waste them.
PERSON 1: That's it?
PERSON 2: That's it. The people who get in front of me twice know how to make the first time count. Same brain. Different sentences.
(Walks away. Glances back.)
PERSON 2: Train. Then come find me.`,
  },
  {
    id: "seed-scene-02",
    type: "scene",
    pattern:
      '[SERVICE PROVIDER fills silence with filler] + [CLIENT diagnoses] + [2nd attempt: "same energy"] + [cost: "clients sit here for an hour"] + [product reveal + personal confession] + [aspirational close]',
    example: `MAYA: So… how's your day going so far?
WOMAN: Fine.
MAYA: Nice weather out there today, isn't it?
WOMAN: …you need small talk training.
MAYA: What? I'm just trying to be friendly.
WOMAN: I know. But "how's your day" and "nice weather" — I can answer that with one word and forget about you the second I leave. Don't you want to turn every client into a regular?
MAYA: …fair.
WOMAN: Try again.
MAYA: …um — got any fun plans for the weekend?
WOMAN: Same energy.
MAYA: …I don't really know what else to ask.
WOMAN: That's the problem. Your clients sit in this chair for an hour. Right now, you're filling it with questions nobody wants to answer.
MAYA: …so what do I do?
WOMAN: RiseGuide. Articulation training. 9 minutes a day. 28 days. Next time the right person gets in your chair for an hour, you won't waste it. I used to be a nail tech too — I own this salon now. And the next forty. Same me. Better communication skills.
MAYA: That's it?
WOMAN: That's it.
(Walks toward door. Glances back.)
WOMAN: Train. Then call me. There's a chair with your name on it — a bigger one.`,
  },
  {
    id: "seed-scene-03",
    type: "scene",
    pattern:
      '[CONFIDENT person approaches attractive stranger] + [STRANGER defaults to filler + weather] + [compliment sandwich diagnosis: "you are X BUT"] + [product reveal] + [leaves number / walks away] + [STRANGER downloads alone]',
    example: `WOMAN: Hi. I saw you from across the bar and figured I'd regret not saying hello.
HOT GUY: Oh — hi. Yeah. Um.
HOT GUY: Cool.
WOMAN: …So. What brings you here tonight?
HOT GUY: Uh — drinks. Just… drinks.
HOT GUY: You?
WOMAN: Same.
HOT GUY: Yeah. Crazy weather, huh?
WOMAN: Okay. Can I be honest with you?
HOT GUY: …sure.
WOMAN: You are stunning. Like, genuinely.
HOT GUY: Oh — thanks —
WOMAN: But I walked over here 45 seconds ago and you've said "cool" three times and asked about the weather.
WOMAN: Look. There's an app. RiseGuide. 9 minutes a day. Trains you to actually hold a conversation instead of defaulting to "cool cool cool." Download it. Practice for 28 days. Then come find me again.
WOMAN: Because right now — face like yours, and I'm still about to walk away.
(Puts number on the bar. Walks away.)
HOT GUY: (alone) …9 minutes. (Opens phone. Downloads.)`,
  },
  {
    id: "seed-scene-04",
    type: "scene",
    pattern:
      '[PERSON rehearses alone, multiple attempts] + [MENTOR interrupts mid-attempt] + [PERSON tries polite alternative] + [MENTOR reframe: "nicer = faster you lose the room"] + [brutal close: "disappear. come back someone worth remembering"]',
    example: `SARAH: Hi, my name is Sarah, nice to meet you… (tries again) Hi! My name is Sarah, I work in— (tries again) Hi, I'm Sarah. Sarah. Just say Sarah.
SARAH: Hi! My name is Sarah, nice to meet you all—
ANNA: Never. And I mean never — introduce yourself by saying your name.
SARAH: Oh — okay. So... nice to meet you?
ANNA: Really. That's your next line?
SARAH: What? I'm just trying to be polite!
ANNA: The nicer you are, the faster you lose the room.
(beat)
ANNA: Disappear for a month. Come back someone worth remembering.`,
  },
  {
    id: "seed-scene-05",
    type: "scene",
    pattern:
      '[JUNIOR approaches SENIOR with weak opener] + [SENIOR: "with small talk like that you won\'t survive X"] + [2nd attempt: "same energy"] + [cost: "ninety seconds / anyone on this floor"] + [product reveal] + [tattooable close: "same brain. different sentences."] + [walk away]',
    example: `PERSON 1: Hey — sorry to interrupt — I've heard so much about you. Huge fan of the work you've been doing.
PERSON 2: Thank you.
PERSON 1: So… how's your week been going?
PERSON 2: …with small talk like that, you will not survive corporate.
PERSON 1: I'm just trying to make conversation.
PERSON 2: That's the worst opener in this building. I can answer that with "busy" and forget you existed by the elevator.
PERSON 1: …fair.
PERSON 2: Try again.
PERSON 1: …so — big projects on your plate right now?
PERSON 2: Same energy.
PERSON 1: …I don't know what else to ask.
PERSON 2: That's the problem. You get maybe ninety seconds with someone like me. And you spent it asking a question I could answer to literally anyone on this floor.
PERSON 1: …how do I fix this?
PERSON 2: RiseGuide. Articulation training. 9 minutes a day. 28 days. Next time you're standing next to the right person, you won't waste it.
PERSON 1: That's it?
PERSON 2: That's it. The people who end up in my inbox after tonight know how to make ninety seconds count. Same brain. Different sentences. That's how you survive corporate.
(Walks away. Glances back.)`,
  },
  {
    id: "seed-scene-06",
    type: "scene",
    pattern:
      '[TRAPPED situation (elevator / ride / stuck)] + [opener: name + boring question] + [diagnosis: "if your name is first you already lost"] + [2nd attempt: worse] + [reframe: "give me a reason to keep listening"] + [product reveal] + [physical exit] + [downloads alone]',
    example: `(Elevator stops between floors.)
HIM: Oh. Looks like we're stuck together.
HER: Looks like it.
HIM: My name is Robert. Nice to meet you.
HER: Never, and I mean never, introduce yourself by saying your name.
HIM: What? I'm just trying to start a conversation.
HER: I know, but if your name is the first thing out of your mouth, you've already lost your first impression.
HIM: Okay, okay. So... what floor do you work on?
HER: Worse. Now you're asking questions nobody wants to answer. And this mistake hurts your reputation.
HIM: Then what am I supposed to do?
HER: Give me a reason to keep listening. You need articulation training. RiseGuide. Nine minutes a day. You'll practice how to actually introduce yourself and start a conversation, instead of defaulting to your name and boring questions nobody wants to answer. Download it. It's twenty-eight days of practice. And then, maybe next time you get stuck with someone, you'll have something to say.
(Elevator jolts. Moves. Doors open. She walks out.)
(He's alone. Takes out his phone.)`,
  },
  {
    id: "seed-scene-07",
    type: "scene",
    pattern:
      '[MAN approaches WOMAN with obvious opener] + [WOMAN: "never and I mean never say that"] + [2nd attempt: weather] + ["really? that\'s your next line?"] + [reframe: "boring / stop being good boy / speak like a man"] + [product reveal] + [download moment]',
    example: `MAN: Hey! Going to the pool?
WOMAN: Never. And I mean never say that.
MAN: Okay, okay. So... hot out today, yeah?
WOMAN: Really? That's your next line?
MAN: What? I'm just trying to break the ice.
WOMAN: You're boring. If you wanna really sound interesting, stop being a good boy. Speak like a man women respect.
MAN: But how?
WOMAN: Articulation training. RiseGuide. 9 minutes a day. Trains you to actually start a conversation instead of defaulting to questions nobody wants to answer. Download it. Practice for 28 days. Then come find me again.
(Man alone.)
MAN: …9 minutes. (Opens phone. Downloads.)`,
  },
];
