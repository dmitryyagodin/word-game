// Wordgame reworked from the python code ps4a.py and ps4b.py
import {wordList} from "./wordList.js";
console.log(typeof wordList);
console.log(wordList.slice(0,10));
const VOWELS = 'aeiou';
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
const HAND_SIZE = 10
const COUNT = 0
const SCRABBLE_LETTER_VALUES = {
  'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1,
   'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1,
    's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
}

function getWordScore(word, n) {
  let score = 0;
  if (n === word.length) {
    score = 50;
  }
  for (let letter of word) {
    score += SCRABBLE_LETTER_VALUES[letter] * word.length;
  }
  return score
}

function displayHand (hand, total) {
  let output = "";
  for (let item in hand) {
    for (let i = 1; i <= hand[item]; i++) {
      output += item + " ";
    } 
  }
  console.log("Current Hand: ", output)
}

function dealHand(n) {
  let hand = {};
  let numVowels = Math.floor(n / 3);

  for (let i = 0; i < numVowels; i++) {
    let item = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    hand[item] ? hand[item]++ : hand[item] = 1;
  }

  for (let i = 0; i < n - numVowels; i++) {
    let item = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    hand[item] ? hand[item]++ : hand[item] = 1;
  }

  return hand
}

function updateHand(hand, word) {
  let handCopy = {...hand};

  word.split("").map(letter => {
    if (handCopy[letter]) {
      handCopy[letter]--;
    }
    if (handCopy[letter] === 0) {
      delete handCopy[letter];
    }
  });
  
  return handCopy
}

function isValidWord(word, hand, wordList) {
  let handCopy = {...hand};
  document.getElementById("wordlist").innerHTML = typeof wordlist;
  console.log("WORDLIST SLICE: ", wordlist.slice(0, 10));
  if (wordList.includes(word.toUpperCase())) {
    return word.split("").every(letter => {
      handCopy[letter]--;
      return handCopy[letter] >= 0;
    })
  } else {
    return false
  }
};


function calculateHandlen(hand) {
  return Object.entries(hand).reduce((a, item) => item[1] + a, 0);
}

function playHand(hand, wordList, n) {
  let total = 0;
  while (calculateHandlen(hand) > 0) {
    displayHand(hand, total);
    let word = prompt('Enter word, or a "." to indicate that you are finished: ');
    if (word === ".") {
      console.log("Goodbye! Total score: " + total + " points.");
      console.log();
      return null
    } else {
      if (isValidWord(word, hand, wordList) === false) {
        console.log("Invalid word, please try again.");
        console.log();
      } else {
        total += getWordScore(word, n);
        console.log(`"${word}" earned ${getWordScore(word, n)} points. Total: ${total} points`);
        console.log();
        hand = updateHand(hand, word);
      }
    }
  }
  console.log();
  console.log("Run out of letters. Total score: " + total + " points.");
}

function playGame(wordList) {
  console.log("Inside playGame")
  let count = 0;
  let hand = dealHand(HAND_SIZE);
  while (true) {
    let game = prompt("Enter n to deal a new hand, r to replay the last hand, or e to end game:");
    switch(game) {
      case 'n':
        hand = dealHand(HAND_SIZE);
        playHand(hand, wordList, HAND_SIZE);
        count++;
        break;
      case 'r':
        count === 0 ?
        console.log("You have not played a hand yet. Please play a new hand first!") :
        playHand(hand, wordList, HAND_SIZE);
        break;
      case 'e':
        return "END OF GAME";
      default:
        console.log("Invalid command.")
    }
  }
}


console.log(playGame(wordList))