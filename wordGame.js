// Wordgame reworked from the python code ps4a.py and ps4b.py
import WORDS from "./words.js";
const userInputButton = document.querySelector("#user-input-button");
const COMPPLAY = document.querySelector('#computer');
const userInput = document.querySelector("#user-input");
const DIALOGUE = document.querySelector("#dialogue-div");
const DISPLAYHAND = document.querySelector("#display-hand");
const VOWELS = 'aeiou';
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
let HANDSIZE = 8;
const LETTER_VALUES = {
  'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1,
   'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1,
    's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
}
// const LETTERS = Object.keys(HAND).sort();

function getWordScore(word, HANDSIZE) {
  let score = 0;
  if (HANDSIZE === word.length) {
    score = 50;
  }
  for (let letter of word) {
    score += LETTER_VALUES[letter] * word.length;
  }
  return score
}

function displayHand(hand, LETTER_VALUES) {
  let boxNumber = 1;
  for (let item in hand) {
    for (let i = 1; i <= hand[item]; i++) {
      document.querySelector(`#display-hand-box-${boxNumber}`)
        .innerHTML = `${item} <sub class="letter-value">${LETTER_VALUES[item]}</sub>`;
      boxNumber++;
    } 
  }
}

function dealHand(HANDSIZE) {
  let hand = {};
  let numVowels = Math.floor(HANDSIZE / 3);

  for (let i = 0; i < numVowels; i++) {
    let item = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    hand[item] ? hand[item]++ : hand[item] = 1;
  }

  for (let i = 0; i < HANDSIZE - numVowels; i++) {
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

function isValidWord(word, hand, WORDS) {
  let letters = Object.keys(hand).sort();
  let handCopy = {...hand};
  
  if (letters.some(letter => WORDS[letter].includes(word))) {
    return word.split("").every(letter => {
      handCopy[letter]--;
      return handCopy[letter] >= 0;
    })
  } else {
    return false
  }
};

function compSearch(word, HAND) {
  let handCopy = {...HAND};
  return word.split("").every(letter => {
    handCopy[letter]--;
    return handCopy[letter] >= 0;
  })
};

function calculateHandlen(hand) {
  return Object.entries(hand).reduce((a, item) => item[1] + a, 0);
}


function playHand(hand, WORDS, HANDSIZE) {
  
  let total = 0;
  displayHand(hand, LETTER_VALUES);
  console.log(hand);
  
  DIALOGUE.innerHTML += '\nEnter word, or a "." to indicate that you are finished:';
  userInputButton.addEventListener('click', async (event) => {
    
    let word = await userInput.value;
    event.preventDefault();
    if (word === '.') {
      DIALOGUE.innerHTML += `\nGoodbye! Total score: ${total} points.`;
      return
    } else {
      if (isValidWord(word, hand, WORDS) === false) {
        DIALOGUE.innerHTML += "\nInvalid word, please try again.";
      } else {
        total += getWordScore(word, HANDSIZE);
        DIALOGUE.innerHTML += `\n"${word}" earned ${getWordScore(word, HANDSIZE)} points. Total: ${total} points`;
        hand = updateHand(hand, word);
        console.log(hand);
        displayHand(hand, LETTER_VALUES);
      }
    }
    if (calculateHandlen(hand) === 0) {
      DIALOGUE.innerHTML += "Run out of letters. Total score: " + total + " points.";
    }
    userInput.value = "";
  })
}

function compChooseWord(hand) {
  let letters = Object.keys(hand).sort();
  let bestWord = "";
  let bestScore = 0;
  for (let letter of letters) {
    WORDS[letter].forEach(word => {
      if (compSearch(word, hand) && getWordScore(word) > bestScore) {
      bestScore = getWordScore(word)
      bestWord = word;
      }
    }); 
  }
  return bestWord
}

function compPlayHand(hand, WORDS, HANDSIZE) {
  let totalScore = 0;
  let handLen = calculateHandlen(hand);
  
  while (handLen > 7) {
    displayHand(hand, LETTER_VALUES);
    let word = compChooseWord(hand, WORDS, HANDSIZE);
    DIALOGUE.innerHTML += `COMPUTER FOUND "${word}"`;
    if (!word) {
      DIALOGUE.innerHTML += "No word";
      break;
    } else {
      if (!isValidWord(word, hand, WORDS)) {
        DIALOGUE.innerHTML = 'This is a terrible error! I need to check my own code!';
        break;
      } else {
        let score = getWordScore(word, HANDSIZE);
        totalScore += score
        DIALOGUE.innerHTML += `"${word}" earned ${getWordScore(word, HANDSIZE)} points. Total: ${totalScore} points`;
        hand = updateHand(hand, word);
      }
    }
  }
  DIALOGUE.innerHTML += `Total score: ${totalScore} points.`;
}

function playGame(WORDS) {
  let count = 0;
  let hand = dealHand(HANDSIZE);
  
  const controlButtons = document.querySelectorAll('.control-buttons');
  document.querySelector("#game-controls").innerHTML = "Enter n to deal a new hand, r to replay the last hand, or e to end game:";
  let whoPlays = 'player';

  COMPPLAY.addEventListener('change', async (event) => {
    event.preventDefault();
    await COMPPLAY.checked ? whoPlays = 'comp' : whoPlays = 'player';
  })
  

  for (let button of controlButtons) {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const game = await button.value + whoPlays;
      
      switch(game) {
        case 'nplayer':
          hand = dealHand(HANDSIZE);
          playHand(hand, WORDS, HANDSIZE);
          count++;
          break;
        case 'rplayer':
          count === 0 ?
          DIALOGUE.innerHTML = "You have not played a hand yet. Please play a new hand first!" :
          playHand(hand, WORDS, HANDSIZE);
          break;
        case 'ncomp':
          hand = dealHand(HANDSIZE);
          compPlayHand(hand, WORDS, HANDSIZE)
          count++;
          break;
        case 'rcomp':
          count === 0 ?
          DIALOGUE.innerHTML = "Please play a new hand first!" :
          compPlayHand(hand, WORDS, HANDSIZE);
          break;
        case 'e':
          return "END OF GAME";
        default:
          DIALOGUE.innerHTML = "Invalid command.";
      }
      
    });
  }
  
}

const STARTBUTTON = document.querySelector("#start-game-btn");
STARTBUTTON.addEventListener('click', async (event) => {
  event.preventDefault();
  return playGame(WORDS);
});
