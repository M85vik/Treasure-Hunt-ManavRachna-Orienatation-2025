// src/utils/quizData.js

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
];

const createOptions = (answerSymbols) => {
  const answerElements = ALL_ELEMENTS.filter((el) =>
    answerSymbols.includes(el.symbol)
  );
  const otherElements = ALL_ELEMENTS.filter(
    (el) => !answerSymbols.includes(el.symbol)
  );
  const shuffledOthers = [...otherElements].sort(() => Math.random() - 0.5);
  const optionsCount = 8;
  const finalOptions = [
    ...answerElements,
    ...shuffledOthers.slice(0, optionsCount - answerElements.length),
  ];
  return [...finalOptions].sort(() => Math.random() - 0.5);
};

export const QUIZ_DATA = {
  example: {
    pun: "What did Magnesium say when it first met Oxygen?",
    answerSymbols: ["O", "Mg"],
    answerExplanation: "OMg!",
    options: [
      { name: "Oxygen", symbol: "O" },
      { name: "Magnesium", symbol: "Mg" },
    ],
  },
  question: {
    pun: "Want to hear a joke about Nitrogen Oxide?",
    answerSymbols: ["N", "O"],
    options: createOptions(["N", "O"]),
  },
};
