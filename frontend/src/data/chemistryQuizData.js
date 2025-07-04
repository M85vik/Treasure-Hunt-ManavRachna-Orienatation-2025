// A pool of all possible elements for generating options
const ALL_ELEMENTS = [
  { name: "Hydrogen", symbol: "H" },
  { name: "Helium", symbol: "He" },
  { name: "Oxygen", symbol: "O" },
  { name: "Sodium", symbol: "Na" },
  { name: "Magnesium", symbol: "Mg" },
  { name: "Potassium", symbol: "K" },
  { name: "Nitrogen", symbol: "N" },
  { name: "Carbon", symbol: "C" },
  { name: "Gold", symbol: "Au" },
  { name: "Silver", symbol: "Ag" },
  { name: "Iron", symbol: "Fe" },
  { name: "Uranium", symbol: "U" },
];

// A helper function to create a random set of options including the correct answer
const createOptions = (answerSymbols) => {
  const answerElements = ALL_ELEMENTS.filter((el) =>
    answerSymbols.includes(el.symbol)
  );
  const otherElements = ALL_ELEMENTS.filter(
    (el) => !answerSymbols.includes(el.symbol)
  );
  // Shuffle the other elements to get a random selection
  const shuffledOthers = [...otherElements].sort(() => Math.random() - 0.5);
  // We want a total of 6 options
  const optionsCount = 6;
  const finalOptions = [
    ...answerElements,
    ...shuffledOthers.slice(0, optionsCount - answerElements.length),
  ];
  // Shuffle the final list so the answers aren't always first
  return [...finalOptions].sort(() => Math.random() - 0.5);
};

// Exporting the final data structure for the quiz
export const QUIZ_DATA = {
  // The example shown to the user before they start
  example: {
    pun: "What did Magnesium say when it first met Oxygen?",
    answerExplanation: "OMg!",
    options: [
      { name: "Oxygen", symbol: "O" },
      { name: "Magnesium", symbol: "Mg" },
    ],
  },
  // The actual question the user must solve
  question: {
    pun: "Want to hear a joke about Nitrogen Oxide?",
    answerSymbols: ["N", "O"],
    // Dynamically generate the options for the question
    options: createOptions(["N", "O"]),
  },
};
