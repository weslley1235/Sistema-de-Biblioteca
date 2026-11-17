const possibleNumbers = [0, 1, 2];

const possibleUpperCaseLetters = ['A', 'B', 'C'];

const possibleLowerCaseLetters = ['a', 'b', 'c'];

const possibleSpecialCharacters = ['@', '$', '#'];

const possibilities = [
  possibleNumbers,
  possibleUpperCaseLetters,
  possibleLowerCaseLetters,
  possibleSpecialCharacters,
];

const generateRandomNumber = (possibilities) =>
  Math.round(Math.random() * possibilities);

const handleRandomCharacter = () => {
  const selectRow = generateRandomNumber(possibilities.length - 1);
  const row = possibilities[selectRow];

  const selectCell = generateRandomNumber(row.length - 1);
  const cell = row[selectCell];

  return cell;
};

const variableRegister = [];

for (let index = 0; index <= 3; index++) {
  variableRegister.push(handleRandomCharacter());
}

console.log(`ADM-${variableRegister.join('')}`);

// ADM-A1A0
