/* Server-side prompt assembly for the Scene Generator. Used only by server.js.
 *
 * Separate from prompts.js (headline generation). SCENE_WRITING_MEMORY and these
 * prompts are an internal implementation detail — never served to the browser
 * (scene-prompts.js is in HIDDEN_FILES).
 *
 * Two stages:
 *   scenarioDesignPrompt() — Stage 1: returns a structured ScenarioSpec (JSON).
 *   sceneWritePrompt()      — Stage 2: writes the scene from that spec.
 *
 * The manual ingredient selections are creative CONSTRAINTS the model must
 * honour and interpret — never slots to fill at fixed points. The model decides
 * how the chosen ingredients combine into one organic dramatic situation.
 */

"use strict";

const SCENE_WRITING_MEMORY = `🎬 SCENE WRITING MEMORY — RiseGuide

ЩО РОБИТЬ СЦЕНУ ЖИВОЮ

1. Фізична деталь у перші 3 секунди
Глядач має бачити конкретну картинку — не "networking event" а "drink in hand, slightly too eager." Не "elevator" а "conference lanyard around his neck."

Хороші приклади з наших сцен:
"drink in hand, slightly too eager" — одразу характеризує PERSON 1 без слів
"One murmurs to the other" — жест розповідає більше ніж репліка
"Looks at himself in the mirror. Exhales." — silent beat що замінює монолог
"Puts number on bar. Walks away." — дія замість пояснення
Погані приклади:
"They are at a networking event talking" — нічого не показує
"She feels awkward" — tell, not show
"He is nervous" — те саме

2. Перша репліка PERSON 1 має бути впізнавано поганою
Не просто "bad opener" — конкретна фраза яку глядач вже казав сам.
Locked fail openers (з наших сцен):
"Big turnout this year, huh?"
"How have you been finding the conference?"
"So what do you do?"
"Crazy weather, huh?"
"Going to the pool?"
"My name is Robert. Nice to meet you."
"Here for the conference?"
"How's your week been going?"
"Working hard or hardly working?"
"So… how are you finding the flight?"
Чому вони працюють: кожна може бути answered in one word. Це і є механізм провалу.

3. One-word rejection — найважливіший beat
Після weak opener — відповідь має бути одне слово або мінімальна ввічливість.
Формула: запитання → "Yeah." / "Yep." / "Fine." / "Sure." / "Mm." / "Cool."
Чому це важливо: глядач впізнає цей moment. Він або давав таку відповідь, або отримував її. Physical recognition = emotional hook.
Погано: одразу довга відповідь від PERSON 2 — губить реалізм і напругу.

4. Panic escalation — 2-3 rounds ПЕРЕД діагнозом
PERSON 1 не здається після першого "yeah." Він продовжує. Кожна наступна спроба — гірша за попередню. Це і є escalation pattern.
З наших сцен:
"Big turnout" → "How have you found the conference?" → "Have you talked to anyone exciting?" (кожна питання ближча до відчаю)
"Big turnout" → "So what do you do?" → "How long have you been in the industry?" (autopilot список)
"Weather" → "What do you do?" → "Are you married?" (Ferris wheel — кожне питання більш invasive)
Правило: кожна наступна спроба має бути або більш generic, або більш invasive. Ніколи — краще.

5. Pivot moment — "Can I say something?" або еквівалент
Це кульмінаційний beat. PERSON 2 зупиняється. Turns. Дивиться прямо.
Варіанти з наших сцен:
"…you need small talk training." (direct, cold)
"Can I be honest with you?" (gentle, bar scene)
"Can I say something?" (Ferris wheel)
"Okay. Stop." (rehearsal scene)
"Does he say the exact same phrase every single Monday?" (third-party observation)
Правило: pivot має бути unexpected. PERSON 2 не повинен виглядати як "trainer waiting to train." Він реагує як реальна людина якій це надоїло або яка щиро хоче допомогти.

6. Diagnosis — конкретна математика, не лекція
Не "you're bad at small talk." А конкретна math:
Хороші diagnoses з наших сцен:
"I can answer that question with one word and forget this conversation ever happened."
"You've said 'cool' three times and asked about the weather."
"You've been talking for four minutes. I've said one sentence. Three of yours were about death."
"We've lived in this building for two years. You've said 'nice weather' to me nine times."
"She heard 'nice to meet you too' 40 times tonight. You just became one of them."
"He asked me 'what do you do?' four times tonight."
"Three years. Same three phrases. Every Monday."
Формула: [конкретний час/число] + [конкретна дія] + [конкретний наслідок]
Погано:
"Your opener was not good."
"You need to be more specific."
"That's not how you do it."

7. Product mention — органічний, varied, не робот
Ніколи не: "And that's why you should use RiseGuide, nine minutes a day, articulation training."
Хороші варіанти:
"RiseGuide. Nine minutes a day. Small talk training." + пауза + одне речення чому
"Someone needs to send him RiseGuide." (third-party, найбільш organic)
"My daughter got me on it after I told her nobody talks to me anymore."
"My wife made me try it. Now I actually know how to talk to my coworkers."
"I got tired of watching us do all the work and get none of the credit."
Правило: product mention завжди йде після diagnosis, ніколи до. І завжди з одним конкретним механізмом ("drills the exact moment you just froze in" / "trains you out of defaulting to 'cool cool cool'").

8. Peer confession — робить продукт believable
PERSON 2 не просто знає — він сам через це пройшов.
З наших сцен:
"I used to ramble too. Different topic. Same panic." (Ferris wheel)
"I used to be the one asking strangers about their weekend in nail salons." → тепер owns 40 of them
"I stopped saying 'sorry, quick thought' six months ago. That's why I got the promotion."
"I got promoted to VP last week." (47yo UGC)
Правило: confession має бути specific — не "I used to be bad at this" а конкретний момент/поведінка.

9. Alternative shown — конкретна replacement line
Не "say something better." А точна лінія яку можна використати завтра.
З наших сцен:
"Elena — the room feels like you." (замість "nice to meet you")
"If you weren't going where you're going tonight, where would you go?" (Uber driver)
"I took our conversion from 12% to 34% in a year." (замість résumé recital)
"We should launch freemium in Q1." (замість "sorry, quick thought")
"Honestly? First event I've been to in months. Still figuring out if I'm glad I came." (замість "I'm fine, thank you")

10. Close — tattoable + physical exit
Остання репліка має звучати як крапка — не питання, не пояснення.
Locked closing lines:
"Train. Then come find me."
"Same brain. Different sentences."
"Now we're talking."
"Yeah. That's exactly the problem."
"That's not networking. It's waiting for the conversation to end."
"Three years." (пауза після питання "how long has everyone known?")
"Disappear for a month. Come back someone worth remembering."
"Because right now — face like yours, and I'm still about to walk away."
Фізичний exit: PERSON 2 іде. Двері закриваються. PERSON 1 залишається один — і скачує app. Це beat який не потребує слів.

ЯК ЛЮДИ РЕАЛЬНО РОЗМОВЛЯЮТЬ (realistic dialogue rules)
✅ Правила:
Люди не закінчують речення коли нервуються: "I mean, it's just — yeah."
Люди повторюють слова: "Cool. Yeah. Cool."
Люди говорять у фрагментах: "Uh — drinks. Just… drinks."
Паузи є частиною діалогу: "(pause)" має своє місце між репліками
Люди шепочуть собі: "…why did I say Ohio."
Люди не одразу відповідають на складне питання — вони freeze
❌ Заборонено:
Perfect grammar у casual розмові
Люди які пояснюють свої почуття: "I feel nervous because..."
Занадто довгі монологи від PERSON 1 (провал завжди короткий)
PERSON 2 каже більше 3 речень підряд без паузи
Будь-яке "as you know" або "let me explain"

ESCALATION PATTERNS (перевірені)
Pattern A — Generic → Invasive
Opener (generic) → Job question → Personal question → Invasive question
Ferris wheel: "kind of high" → "what do you do" → "are you married?"
Pattern B — Polite → Desperate
Opener → One word back → Panic filler → Topic-jumping → Complete non sequitur
Hotel elevator: "big turnout" → "yeah" → "how's your week" → "big projects?"
Pattern C — Autopilot list
Three-question loop: "Where are you from?" → "What do you do?" → "How long have you been here?"
Networking event: всі три питання можна відповісти в одне слово
Pattern D — Over-explanation spiral
One okay start → nervousness → ramble → death statistics → "why did I bring up death"
Power Tower: opener → death stats → marriage question → stranger moves seats

DRAMATIC TURNS (що робить сцену memorable)
✅ Найсильніші поворотні моменти:
Physical rejection — stranger moves seats на rollercoaster
Third-party overhear — PERSON 1 чує як про нього говорять
Mirror moment — PERSON 1 бачить себе після провалу (hotel elevator mirror)
Women murmur to each other — невербальне засудження
Number on bar — woman leaves without asking to stay
Download alone — PERSON 1 сам, відкриває телефон
"Try again" — і PERSON 1 провалюється знову
"Same energy" — після другої спроби — найбрутальніший одним словом вирок
❌ Forbidden dramatic turns (clichés):
PERSON 1 раптово стає харизматичним після продукту (занадто швидко)
PERSON 2 одразу знайомиться і вони стають друзями (нереально)
Magical transformation в тій самій сцені
PERSON 1 каже "wow, thank you so much!" (занадто grateful)
Happy ending у 30 секунд

FORBIDDEN CLICHÉS (список)
Фрази які вбивають реалізм:
"That's such a great point!"
"I never thought of it that way."
"You're so right, I'll definitely do that."
"Wow, you changed my life."
"I've been looking for something like this."
"Let me tell you something important..."
"Here's the thing about small talk..."
"As a communication expert..."
Ситуації які не працюють:
PERSON 2 підходить до PERSON 1 і одразу починає teaching (нереально)
Product reveal у перші 10 секунд сцени
PERSON 1 сам знає що він поганий і просить допомоги одразу
PERSON 2 занадто nice під час diagnosis — "gentle mentor" не працює
Сцена без конкретного фізичного setting

PRODUCT PLACEMENT — ОРГАНІЧНІ СПОСОБИ
Тип 1 — Direct recommendation (peer to peer)
"RiseGuide. Nine minutes a day." + пауза + один механізм + одна confession
Тип 2 — Third-party recommendation (найорганічніший)
"Someone needs to get him on RiseGuide."
"What's that?" / "Small talk training. Nine minutes a day."
Тип 3 — Self-confession reveal
"My daughter got me on it after I told her nobody talks to me anymore."
"I made my whole team do it."
"My wife made me try it."
Тип 4 — Download moment (без слів)
PERSON 1 сам. Phone out. Types: RiseGuide. Audience inference = strongest.
Тип 5 — В діалозі як solution до specific problem
"It drills exactly this — the freeze, the default, the question nobody wants to answer."
Заборонено:
❌ Product у перших 30% сцени
❌ "You should try..." (занадто advice-y)
❌ Listing features: "It has modules on X, Y, Z..."
❌ Повторювати "RiseGuide" більше 2 разів в одній сцені

PACING RULES
Ритм сцени (це орієнтир, не жорсткий template):
0-10 sec: Physical setup + weak opener
10-20 sec: One-word rejections (2-3 rounds)
20-35 sec: Pivot moment + diagnosis
35-50 sec: "How do I fix this?" + product reveal + peer confession
50-60 sec: Alternative shown + tattoable close + physical exit
Мовчання як інструмент:
"(pause)" після diagnosis = gives audience time to feel it
"(silence)" після rejection = the worst beat, more powerful than words
Silent exit (doors close / walks away) = stronger than verbal goodbye
Довжина реплік:
PERSON 1 fail: 1-3 sentences max (panic is short)
PERSON 2 diagnosis: 2-4 sentences (precise, not lecture)
Product mention: 2-3 sentences
Closing line: 1 sentence

CHARACTER BEHAVIOR RULES
PERSON 1 (the one who fails):
Фізично nervous: "drink in hand" / "fumbles bagging" / "kicks a leaf"
Whispers to himself після провалу
Says "fair" коли caught — це universal shame response
Tries again після rejection (не здається одразу)
Downloads alone without audience — private moment
PERSON 2 (the one who diagnoses):
Calm, not mean. Precise, not cruel.
Short responses during diagnosis — economics of words
Slight smile (not smirk) before product reveal
Physical exit = authority. Stays = lecturing.
Never explains more than needed
Third-party characters:
React nonverbally: murmur / laugh / glance
Never explain what they think — they show it

VISUAL STORYTELLING
Що має бути в кожній сцені:
Establishing shot detail — одна фізична деталь що встановлює world
Close-up moment — обличчя PERSON 1 після rejection
Silent beat — момент без слів де все зрозуміло
Physical exit — PERSON 2 іде / двері закриваються / PERSON 1 залишається
Найсильніші visual beats з наших сцен:
"Looks at himself in the mirror. Exhales." (hotel elevator)
"Stranger moves to row 3. PERSON 1 sits alone." (rollercoaster)
"Puts number on bar. Walks away." (bar scene)
"Opens phone. Downloads." (silent finale)
"Doors close. He's alone." (elevator scenes)
"Leaves crunch underfoot." (autumn street)

ХОРОШІ ПРИКЛАДИ СЦЕН (ranked)
🥇 TIER 1:
Conference scene ("Train. Then come find me.") — VIP energy / "same energy" вирок / "one chance you get to talk to me" / tattoable close / physical walk-away
Bar scene (Hot guy downloads alone) — Gender flip / compliment sandwich diagnosis / number on bar / silent download
Rollercoaster (stranger moves seats) — Physical rejection є самою сценою / "why did I say Ohio" / peer arrives on vacated seat
Elevator (mirror moment) — Trapped situation / mirror beat / "give me a reason to keep listening" / clean product reveal
🥈 TIER 2:
Nail salon (own 40 salons) — Service provider context / aspirational close / peer confession specific
Hotel elevator (women murmur) — Third-party observation / "Every. Single. Time." / silent humiliation
Coffee machine with VP — Career context / "tell me one thing you shipped" alternative

ПОГАНІ ПРИКЛАДИ (що не робити)
❌ Занадто швидкий fix: PERSON 1 одразу застосовує нову фразу і це working beautifully — нереально за 30 секунд.
❌ Product reveal занадто early: "Hey, have you heard about RiseGuide?" — без diagnosis, без pain.
❌ PERSON 2 занадто nice: "Oh, I understand, it can be hard to find the right words." — губить dramatic tension.
❌ Generic setting: "They are talking at a party" без деталей.
❌ Довгий монолог PERSON 1: nervous people say LESS, not more.
❌ Happy ending занадто явний: PERSON 2 одразу "great! let's talk more!".

НОВІ РЕФЕРЕНСНІ СЦЕНИ:
Nice to meet you — gallery scene: "She said 'nice to meet you.' You said 'nice to meet you too.' That's not a conversation. That's an echo." → Echo metaphor = tattoable.
Autumn street: Physical setting (leaves crunching) = звук = immersion / "I could have had this conversation with anyone on this street".
Office kitchen (autopilot Monday): Third-party observation architecture / "Same three phrases. Every Monday. For three years." / overhear version = self-confrontation без confrontation.
Brain vs Mouth: Internal dialogue format = universally relatable / "I'm tired of doing all the thinking and getting none of the credit".`;

/* ---------- shared framing ---------- */

const PRODUCT_FACTS = `The product is an articulation training app. 9 minutes a day. 28 days.

BRAND NAME — HARD RULE. The name "RiseGuide" must NEVER appear anywhere in a generated scene — not in dialogue, not in stage directions, not on a phone screen. The SCENE WRITING MEMORY below shows brand-name lines in its examples; ignore that, those are old references. When the product is mentioned, a character refers to it by category or mechanism, whichever fits the scene naturally:
- "articulation training" / "small talk training"
- "It drills exactly this kind of moment." / "It trains you out of loading the next line."
- "Nine minutes a day." / "Twenty-eight days." (the spec is fine — it is not the brand)
So: "I started doing articulation training." — yes. "It's small talk training. Nine minutes a day." — yes. "Try RiseGuide." / "My wife got me on RiseGuide." / "RiseGuide. Nine minutes a day." — never.

Never invent statistics, customer counts, results, testimonials, comparative claims, or timeframes tied to an outcome. A first-person line about a past change ("I stopped saying 'sorry, quick thought' six months ago") is fine; a promise about the viewer's future is not. Never append disclaimer text to the scene.`;

function ingredientLine(label, value) {
  const v = (value == null ? "" : String(value)).trim();
  if (!v || /^(random|ai|ai decides|you decide|—)$/i.test(v)) {
    return `- ${label}: (you choose — pick what best fits the situation you are designing)`;
  }
  return `- ${label}: ${v}`;
}

/* ---------- Stage 1: scenario design ---------- */

function scenarioDesignPrompt({ inputs = {}, mode = "full", prevSpec = null, avoid = [] }) {
  const i = inputs;

  const ingredients = [
    ingredientLine("Topic", i.topic),
    ingredientLine("Setting", i.setting),
    ingredientLine("Character A — the one whose communication fails", i.characterA),
    ingredientLine("Character B — the one who notices / reacts", i.characterB),
    ingredientLine("Social dynamic", i.socialDynamic),
    ingredientLine("Escalation pattern (a direction for how tension builds — NOT a fixed question sequence)", i.escalationPattern),
    ingredientLine("Dramatic turn (the kind of turn — design its most natural form for these people/place/conflict)", i.dramaticTurn),
    ingredientLine("Product placement type (the type is fixed; where and how it lands is your call)", i.productPlacement),
    ingredientLine("Length", i.length),
    ingredientLine("Creative direction", i.creativeDirection),
  ].join("\n");

  const givenSituation =
    (i.scenarioMode === "given" || i.scenarioMode === "manual") && i.scenario && i.scenario.trim()
      ? i.scenario.trim()
      : "";
  const scenarioBlock = givenSituation
    ? `The user chose this common, real-life situation. Build the scene INSIDE exactly this — do not replace it, do not escalate it into something extraordinary. Find the communication problem inside the ordinary version of it:
"${givenSituation}"`
    : "The user did not name a situation. Design one — but it must be a common, recognizable situation that could realistically happen tomorrow, described as WHAT IS HAPPENING (a concrete moment), not what the dialogue should be. Do not invent an unusual or cinematic setup.";

  let modeBlock = "";
  if (mode === "regen-scenario" && prevSpec) {
    modeBlock = `## REGENERATE — NEW SCENARIO, SAME INGREDIENTS
Keep every manual ingredient selection above. Design a genuinely DIFFERENT human conflict and situation. Do not reuse the situation, the conflict, the failure behaviour, or the turn from this earlier version:
${JSON.stringify({ scenario: prevSpec.scenario, conflictSource: prevSpec.conflictSource, dramaticTurn: prevSpec.dramaticTurn }, null, 2)}`;
  } else if (mode === "regen-turn" && prevSpec) {
    modeBlock = `## REGENERATE — SAME SITUATION, DIFFERENT TURN
Keep this locked, unchanged:
${JSON.stringify({ setting: prevSpec.setting, characters: prevSpec.characters, socialDynamic: prevSpec.socialDynamic, scenario: prevSpec.scenario, person1Wants: prevSpec.person1Wants, person2Wants: prevSpec.person2Wants, conflictSource: prevSpec.conflictSource, communicationFailure: prevSpec.communicationFailure }, null, 2)}
Re-choose the dramatic turn and how the escalation builds toward it. The new turn must be a different kind than "${prevSpec.dramaticTurn && prevSpec.dramaticTurn.type}". Keep the length and creative direction.`;
  } else if (mode === "regen-characters" && prevSpec) {
    modeBlock = `## REGENERATE — SAME SETTING, DIFFERENT CHARACTERS
Keep the setting ("${prevSpec.setting}") and the topic ("${prevSpec.topic}"). Choose new characters and a new social dynamic. The conflict and situation should change to fit the new pairing — do not staple the old conflict onto new people.`;
  }

  const avoidBlock =
    Array.isArray(avoid) && avoid.length
      ? `## DO NOT REPEAT
These scene angles were already generated in this session. Your scenario must not overlap with any of them:\n${avoid.map((a) => `- ${a}`).join("\n")}`
      : "";

  return `You are a director designing the dramatic situation for a short RiseGuide scene (social video). You are NOT writing the scene yet — that is the next step. Your only job now is to design a believable, specific situation that a scene will be written from.

${PRODUCT_FACTS}

<scene_writing_memory>
${SCENE_WRITING_MEMORY}
</scene_writing_memory>

The memory is mixed Ukrainian and English — read all of it. It is the source of truth for realism, pacing, dialogue, turns, product placement and forbidden clichés. Extract its principles. Do not reproduce its example scenes. Think and answer in English.

## THE INGREDIENTS THE USER SELECTED

${ingredients}

${scenarioBlock}

Treat each selected ingredient as a creative constraint you must honour and interpret — never a slot to fill at a fixed point. "Third-party overhear" does not mean an overheard line dropped at a scripted beat; it means design the most natural version of that turn for THESE characters, THIS place, THIS conflict. "Over-explanation spiral" is a direction for how the tension rises, not a mandatory sequence of lines. Where an ingredient says "(you choose)", pick a concrete value that coheres with everything else.

## GROUNDING — THIS IS NOT A MOVIE

Familiar situation first. Creative interpretation second. The situation must be something that could realistically happen tomorrow — not something invented to make the ad interesting.

Do NOT invent extraordinary circumstances for drama. No mysterious strangers, bizarre coincidences, emergencies, shocking revelations, unrealistic confrontations, movie-like twists, implausibly perfect setups, or characters behaving unnaturally just to manufacture a product moment. If the user picked "airport gate", it stays an ordinary airport gate — never an airport emergency.

The drama comes ONLY from the communication problem. Prefer: an awkward introduction; a conversation that quietly dies; someone answering in one word; someone talking too much; someone who doesn't know what to say next; a repeated interaction; a status difference; professional pressure; attraction; embarrassment; a missed opportunity; someone trying too hard; someone being polite but clearly wanting to leave; ordinary social friction. The people behave like real people in a normal moment — the interaction is what's sharp, not the circumstances.

${modeBlock}

${avoidBlock}

## WHAT TO WORK OUT

Design the situation by answering, in your head, all of the following, then encode the result as JSON:

- Why are these two specific people in the same place at the same time? (a real reason, not "they both happen to be there")
- What is the concrete role label for each character — specific to who they are in THIS scene, in CAPS, for use as the speaker name in the script (e.g. JUNIOR ACCOUNT EXECUTIVE, VP OF SALES, JOB CANDIDATE, HIRING MANAGER, RIDESHARE DRIVER, NAIL TECH, NEW HIRE). Never PERSON 1 / PERSON 2 / MAN / WOMAN / GUY / GIRL. If the dramatic turn brings in a third person, give them a concrete role label too.
- What does the first character (the one whose communication fails) want in this moment? What does the second want?
- What exactly creates the friction between what the first character wants and what they are doing?
- What is the specific communication behaviour of the first character that causes the problem? (a concrete speech habit, phrase, or pattern — not "bad communication")
- Why does this situation escalate on its own — what about the setting or the stakes keeps them going?
- How do the selected dramatic ingredients (the turn, the escalation direction) naturally interact with each other and with this conflict?
- Why would the second character realistically notice and react — as a real person who is done with it or genuinely wants to help, not a trainer waiting to train?
- THE PRODUCT ENTRY — the hardest part, and the one that usually breaks. The recommendation must be CAUSALLY AND CHARACTER-LOGICALLY EARNED. It is not a required beat and it does not have to come from whoever diagnosed the problem. Before you place it, you must be able to answer all of:
  1. WHO recommends the product?
  2. WHY does that person credibly know about it? (they went through the same thing / they have watched this exact pattern before / they know this specific person's struggle)
  3. What EVIDENCE, visible in the scene, shows that this person is NOT doing the thing themselves — that they actually changed, or that they genuinely recognise the pattern from experience? Their credibility must come from the scenario, never from the line "this helped me" alone.
  4. WHY would they recommend it to THIS person specifically?
  5. WHY does the recommendation happen NOW, at this exact moment?
  If those five answers don't hold together, the placement is INVALID — rewrite the scenario architecture (who's in the scene, who's the recommender, how they behave) before you place any product.
  HARD BAN — retroactive claims: a character who has demonstrated the exact communication problem throughout the scene CANNOT then claim they solved it with the training. That is a contradiction. If the recommender is a reformed sufferer, the scene must show them NOT behaving that way (a clean, specific line; actually answering what was said; getting to the point) — or make the recommender a credible third party (a coworker, a family member, someone who's watched this happen) instead.
  The recommendation should feel like "I've seen this before — here's what actually helped," never "anyway, here's the product this ad is selling." Named as "articulation training" / "small talk training" or by mechanism, never a brand name, never "you should try..." / "I recommend...", never a coach speech or feature list, never landing the instant the diagnosis ends. The mechanism named maps to the failure we just watched (freeze -> speaking under pressure; generic opener -> opening with a point; rambling -> point first).
- What physical action or beat ends the scene — earned by this situation, not a generic walk-away?
- If the product were deleted from the scene entirely, would the situation still work as a compelling dramatic moment? It must.

## OUTPUT — JSON only, no prose around it

{
  "topic": "...",
  "setting": "concrete place + one establishing physical detail",
  "characters": [
    { "label": "CONCRETE ROLE IN CAPS", "who": "one line — who they are relative to the other", "descriptor": "one concrete physical or behavioural detail" },
    { "label": "CONCRETE ROLE IN CAPS", "who": "...", "descriptor": "..." }
  ],
  "socialDynamic": "...",
  "scenario": "2-4 sentences: what is literally happening",
  "whyTogether": "why these two are here, now",
  "person1Wants": "what the first character wants",
  "person2Wants": "what the second character wants",
  "conflictSource": "what exactly creates the friction",
  "communicationFailure": "the specific speech behaviour that causes the problem",
  "escalation": { "direction": "the chosen pattern, restated as a direction for this situation", "howItBuilds": "why the tension rises here" },
  "dramaticTurn": { "type": "the chosen kind of turn", "howItHappensHere": "the most natural version of it for these characters/setting/conflict" },
  "productPlacement": {
    "type": "the chosen type",
    "recommender": "which character raises it, and why they credibly know about it (went through the same thing / has watched this pattern before / knows this person's struggle)",
    "credibilityEvidence": "what the scene SHOWS that proves the recommender isn't doing the thing themselves — a clean specific line, actually answering what was said, getting to the point — or that they genuinely recognise the pattern from experience. If you can't name concrete in-scene evidence, this recommender is wrong — change it.",
    "whyThisPerson": "why they'd say it to THIS person specifically",
    "whyNow": "why the recommendation happens at this exact moment",
    "moment": "where in the arc it surfaces (never immediately after the diagnosis line, never a coach speech)",
    "mechanismLine": "the one concrete thing it drills, mapped to the failure we just watched, as 'articulation training' / 'small talk training' or a mechanism — never a brand name, never 'you should try'"
  },
  "ending": "the physical / action beat that closes the scene",
  "length": "one of: 30 sec | 45 sec | 60 sec | 90 sec",
  "creativeDirection": "echo the user's note, or \\"\\" ",
  "resolvedFromRandom": ["names of any fields you chose because the user left them open"],
  "removeProductTest": "one sentence: why this scene still works as a dramatic moment with the product deleted"
}

Return the JSON object and nothing else.`;
}

/* ---------- Stage 2: scene writing ---------- */

function sceneWritePrompt({ spec, regenTarget = null, prevScene = "", avoid = [] }) {
  const lengthGuide = {
    "30 sec": "about 6-9 short exchanges. Very tight. One rejection round, quick turn, quick close.",
    "45 sec": "about 10-14 exchanges.",
    "60 sec": "about 14-20 exchanges.",
    "90 sec": "about 20-30 exchanges. Room for a second failed attempt and a longer silence.",
  }[String(spec && spec.length).trim()] || "about 14-20 exchanges.";

  const avoidBlock =
    Array.isArray(avoid) && avoid.length
      ? `\n\nThese angles were already used this session — your scene must not read like any of them:\n${avoid.map((a) => `- ${a}`).join("\n")}`
      : "";

  let task;
  if (regenTarget === "ending") {
    task = `## REGENERATE THE ENDING ONLY
Here is the existing scene:

${prevScene}

Keep everything up to the final beat exactly as it is. Replace ONLY the ending — the last physical action and the closing line — with a different one that still fits this situation and the spec's ending intent ("${spec.ending}"). Return the FULL scene with the new ending, in the same output format below.`;
  } else if (regenTarget === "product") {
    task = `## REGENERATE THE PRODUCT PLACEMENT ONLY
Here is the existing scene:

${prevScene}

Keep the scene. Change ONLY how and where the product surfaces. Same placement type ("${spec.productPlacement && spec.productPlacement.type}"), but a different, still-earned entry. The new recommender must have credibility that comes from the scene itself: they are shown NOT doing the failing behaviour, or they are a genuine third party who has watched this exact pattern before, or they know this person's struggle. A character who has demonstrated the problem all scene cannot claim they solved it — pick a different recommender or a phone/download beat instead. Still "articulation training" / "small talk training" or by mechanism, never a brand name; never "you should try..."; never a coach speech; never the instant the diagnosis ends. If the type is quiet/silent, let the closing action carry it with nobody naming it. Return the FULL scene with the new placement, in the same output format below.`;
  } else {
    task = `## WRITE THE SCENE
Write the scene from the scenario below. Follow the SCENE WRITING MEMORY's principles for physical detail, one-word rejections, escalation, the turn, diagnosis-as-math, and the physical close. Length: ${spec && spec.length} — ${lengthGuide}

The pacing beats in the memory are a guide, not a template. Use the dramatic architecture the scenario calls for. Do not make every selected ingredient a visibly bolted-on beat — the scene must feel like something that happened, not a checklist worked through. Every ingredient in the spec is present, but woven in.

THE PRODUCT MOMENT — it must be logically inevitable, not scheduled. We are NOT trying to make it shorter; we are trying to make it earned.

Build it exactly as the scenario's productPlacement describes — recommender / credibilityEvidence / whyThisPerson / whyNow / moment. The recommender's credibility has to be visible IN THE SCENE:
- A reformed sufferer only works if the scene has already SHOWN them not doing it — a clean, specific line; actually answering what was said; getting to the point. If the character who recommends the training has themselves been rambling / asking dead-end questions / hedging all scene, that is a contradiction — do not let them claim "I used to do this, it helped." Use a different recommender (a coworker, a family member, someone who's watched it happen) or a phone/download beat instead.
- A third party works if they have plainly seen this pattern ("My daughter put me on small talk training when I caught myself doing the exact same thing" / "Half my team's on it").
- Proof through behaviour: they demonstrate the better line first, then briefly say why they can.
- Quiet discovery: nobody sells anything — the failing character is left alone and searches for it. If the placement is this type, no one names the product out loud; the final action carries it.

The mechanism named maps to the failure we just watched. It should feel like "I've seen this before — here's what actually helped," never "anyway, here's the product." Never "you should try..." / "I recommend...", never a coach speech or feature list, never landing the instant the diagnosis ends. If the scene as written cannot support a credible recommendation, that means the scenario architecture is wrong for a spoken recommendation — use the silent phone/download beat.`;
  }

  return `You are writing a short scene for social video (a RiseGuide ad) — dialogue-driven, shot as a real moment.

${PRODUCT_FACTS}

<scene_writing_memory>
${SCENE_WRITING_MEMORY}
</scene_writing_memory>

The memory is mixed Ukrainian and English — read all of it. Write the scene in natural spoken English.

## THE SCENARIO (already designed — build the scene on exactly this)

${JSON.stringify(spec, null, 2)}

## SPEAKER LABELS

Name every speaker by the concrete role label in the scenario's "characters" (e.g. ${
    (spec && Array.isArray(spec.characters) && spec.characters[0] && spec.characters[0].label) ||
    "JUNIOR ACCOUNT EXECUTIVE"
  } / ${
    (spec && Array.isArray(spec.characters) && spec.characters[1] && spec.characters[1].label) ||
    "VP OF SALES"
  }). Use the exact same label every time that person speaks. If the dramatic turn brings in a third person, give them their own concrete role label. NEVER use PERSON 1, PERSON 2, MAN, WOMAN, GUY, GIRL, or a bare first name as a speaker label. The memory writes its examples as "PERSON 1 / PERSON 2" — do not copy that.

${task}${avoidBlock}

## CONTEXT ECONOMY — GIVE THE AUDIENCE JUST ENOUGH, THEN GET OUT OF THE WAY

The scene must feel like a 60-second moment someone happened to capture — not a 5-minute story compressed into one. We should feel like we walked into the middle of a real moment, not like a narrator is introducing us to a world.

Do not explain what the audience can infer. The setting, the relationship, the stakes, the backstory, what each person feels and why it matters — the audience gets all of this from a few concrete details and the dialogue itself. Clarity is not the same as explanation. A scene can be completely clear with very little information.

Rules:

- THREE LAYERS OF CONTEXT, NO MORE. (1) One physical detail for where we are. (2) One behavioural detail for who these people are to each other. (3) Let the dialogue reveal the problem. Do not add a fourth layer that explains the backstory.
- ONE CONCRETE DETAIL IS ENOUGH for any piece of context. Not "she was a regular who'd been coming for years and was friendly with the barber" — instead the barber just says "Same as last time?" and the relationship is understood. Not "he was nervous about his first board presentation" — instead "(The deck is open on his laptop. Board meeting in ten minutes.)"
- DIALOGUE IS NOT A BACKSTORY DELIVERY SYSTEM. Real people do not explain shared history to someone who already knows it. No "as you know", no "we've worked together three years and I've always struggled to—", no character narrating their own motivation. If both characters already know it, find a visual or behavioural way to show it, or cut it.
- 1–2 SENTENCES OF CONTEXT PER TURN, MAX. If a character starts explaining their history / the situation / their motivation / why they're nervous / what happened earlier — stop, and ask whether an action, object, or shorter line can carry it. It almost always can.
- NO MOTIVATION EXPLANATION. Not "he was embarrassed" — "(He looks down at his drink.)" Not "she didn't know what to say" — "(She opens her mouth. Nothing.)" Physical detail replaces the sentence.
- SHORTER DIALOGUE THAN FEELS natural to write — especially for the failing character. They do not explain their problem. They accidentally reveal it through what they say and do. The audience discovers it; nobody states it.
- THE PRODUCT LINE IS SHORT TOO. The recommender does not explain what the product is, why it exists, its features, the mechanism in full, or the other person's whole problem. The scene already established the problem. "I used to do the same thing." (pause) "Started doing small talk training." — plus at most one concrete line of what it drills. That's the whole recommendation.
- THE REMOVE-HALF TEST: after drafting, look at every contextual sentence and stage direction. If deleting it still leaves the audience able to follow the scene, delete it. Do this aggressively. Keep fewer details — but make each one more specific.

Maximise recognition per line, not information per scene. Every line must move the interaction, reveal character, reveal the communication failure, build tension, turn the scene, connect to the solution, or land the close. A line that exists only to inform the audience gets cut.

## BEFORE YOU RETURN IT — reject and rewrite internally if any of these are true

- The word "RiseGuide" appears anywhere in the scene — dialogue, stage direction, or a screen. (The product is referred to only as "articulation training" / "small talk training" or by mechanism.)
- Any speaker is labelled PERSON 1 / PERSON 2 / MAN / WOMAN / GUY / GIRL instead of a concrete role.
- The person recommending the training demonstrates, anywhere in the scene, the same communication problem they claim it solved — rambling, dead-end questions, hedging. (A reformed sufferer must be shown NOT doing it.)
- "I used to..." / "this helped me" is not supported by anything visible in the scene — the recommender's credibility is only asserted, never shown.
- A character suddenly becomes an expert on the problem with no justification for how they'd know.
- The product is there only because the script needs a product mention.
- The recommendation could be lifted into any other scene without changing a word.
- The recommendation does not follow directly from the specific human problem we just watched.
- The recommender's behaviour before the recommendation contradicts the recommendation.
- The product mention isn't earned — you cannot answer "who recommends it, why do they credibly know, what shows they changed, why this person, why now" from the scene itself.
- The product lands the instant the diagnosis ends, or a character says "you should try..." / "I recommend...", or switches into coach / advertiser voice, or lists features.
- The placement is a quiet-discovery / silent type but a character still names the product out loud.
- The situation is extraordinary, cinematic, or invented for drama rather than something that could plainly happen tomorrow (an emergency, a bizarre coincidence, a shocking reveal, a mysterious stranger, a movie-like twist).
- The drama comes from an unusual plot rather than from the communication problem.
- The user named a situation and the scene has drifted out of it or blown it up into something bigger.
- It feels like an ad disguised as dialogue.
- The second character exists only to teach the first.
- The product is mentioned before the problem is established.
- Characters behave unnaturally just to deliver information.
- Dialogue sounds written, not spoken (perfect grammar under stress, people explaining their feelings, long monologues from the one who is failing).
- The setting could be swapped for any generic location.
- The dramatic turn is predictable, or it reads as a bolted-on beat rather than something that happened.
- It needs a narrator to explain what is happening.
- The scene opens by introducing the world ("After a long day...", "She had always...", "For the past three years...", "Neither of them knew...") instead of dropping us into a live moment.
- Any character delivers more than 1–2 sentences of context, backstory, or motivation at once — history, why they're there, what happened earlier, why it matters.
- A character says out loud something both characters already know, so the audience can hear it ("As you know...", "We've worked together three years and...").
- A stage direction states a feeling or a realisation ("he was uncomfortable", "she realised he wasn't interested") instead of showing it through an action or object.
- The failing character explains their own problem instead of accidentally revealing it through what they say and do.
- The product recommendation explains what the product is, its features, or the whole mechanism, rather than one short conversational line plus at most one concrete thing it drills.
- Any contextual sentence could be deleted with the audience still able to follow the scene, and it is still there.
- The failing character becomes charismatic right after one piece of advice, or the scene ends in a happy transformation.
- The same insight could carry 50 other scenes unchanged.
- The product could be removed and nothing about the scene would change.
- It is basically a headline expanded into dialogue.
- A character explains the lesson to the audience.
- Any selected ingredient is mechanically visible as a checklist item.
- It sounds like ChatGPT, LinkedIn, motivational content, or an ad script.
- It uses any forbidden cliché line from the memory.

Prefer: physical details, imperfect speech, silence and pauses, social consequence, status dynamics, small human behaviours, uncomfortable recognition, an unexpected-but-believable turn, dialogue that sounds overheard rather than written.

## OUTPUT — exactly this format, nothing before or after

TITLE: <short, not a headline, not a slogan>

SETTING: <one line>

CHARACTERS: <one line — the concrete role labels and who they are>

SCENARIO: <1-2 sentences — the situation>

DRAMATIC TURN: <one line — what turns the scene>

SCENE:
<the script. Open in the middle of a live moment — one physical detail, then straight into it; never a line that introduces the situation. Concrete role labels as speaker names + lines. Physical beats in parentheses, kept short and concrete. Blank line between speakers. NO narration, NO meta-commentary, NO explaining the lesson inside the dialogue, NO backstory a character wouldn't actually say.>

CREATIVE LOGIC: <2-4 sentences on why this situation and this architecture — this section only, never inside the SCENE>`;
}

module.exports = { scenarioDesignPrompt, sceneWritePrompt };
