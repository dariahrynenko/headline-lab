/* Hardcoded starter Topics.
 *
 * These are copied into localStorage on first run (see storage.js). After that
 * they behave like any other Topic: editable and deletable. Editing a seed
 * Topic changes only the stored copy, never this file.
 *
 * Each entry needs: id, name, description, pains[]. The `seed: true` flag is
 * used only for a small "starter" label in the UI. createdAt / updatedAt are
 * filled in by storage.js when the seeds are first written.
 */
window.SEED_TOPICS = [
  {
    id: "seed-freelance-invoicing",
    seed: true,
    name: "Freelance invoicing",
    description:
      "Independent freelancers who send invoices manually after each project. They track what is owed in spreadsheets or in their head, and chase late payments over email.",
    pains: [
      "I finish the work but forget to send the invoice for days",
      "I never know how much money is actually owed to me right now",
      "Chasing late payers makes me feel like a nuisance",
      "Reconciling who paid what at month-end eats a whole evening",
    ],
  },
  {
    id: "seed-weight-loss",
    seed: true,
    name: "Weight loss",
    description:
      "People who have tried many diets and lost then regained weight. They believe their failure is due to a lack of willpower and feel guilty about it.",
    pains: [
      "I always start strong and fall off after two weeks",
      "I feel like I'm just not disciplined enough",
      "Every diet works for a while and then stops",
      "I'm tired of starting over every Monday",
    ],
  },
  {
    id: "seed-learning-a-language",
    seed: true,
    name: "Learning a language",
    description:
      "Adults learning a second language on their own with apps and courses. They study on and off for years without reaching conversational fluency.",
    pains: [
      "I've been 'learning' for years and still can't hold a conversation",
      "I know grammar rules but freeze when someone speaks to me",
      "I lose my streak and my motivation collapses",
      "I don't know if what I'm doing is actually working",
    ],
  },
  {
    id: "seed-b2b-cold-email",
    seed: true,
    name: "B2B cold email",
    description:
      "Founders and sales reps at small B2B companies who send cold outbound email to book meetings. They copy templates from the internet and get almost no replies.",
    pains: [
      "My open rates look fine but nobody replies",
      "Every email I send sounds like every other cold email",
      "I don't know if the problem is the list, the copy, or the offer",
      "Following up feels like begging",
    ],
  },
  {
    id: "seed-personal-budgeting",
    seed: true,
    name: "Personal budgeting",
    description:
      "People in their 20s and 30s who want to save money but have never kept a budget for more than a month. They feel anxious checking their bank balance.",
    pains: [
      "I set up a budget every January and abandon it by February",
      "Money disappears and I can't say where it went",
      "I avoid looking at my account because it stresses me out",
      "I earn more than I used to but I'm not saving any more than before",
    ],
  },
];
