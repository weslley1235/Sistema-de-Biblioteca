
const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const possibleUpperCaseLetters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U',
  'V', 'W', 'X', 'Y', 'Z'];

const possibleLowerCaseLetters = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z'];

const possibleSpecialCharacters = ['@', '#', '$', '!', '*', '&', '%', '?'];

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

console.log(`adm-${variableRegister.join('')}`);

// ADM-A1A0
