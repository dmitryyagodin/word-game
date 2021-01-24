// Wordgame reworked from the python code ps4a.py and ps4b.py
import WORDS from "./words.js";
const userInputButton = document.querySelector("#user-input-btn");
const TOTAL_POINTS = document.querySelector("#total-points");
const userInput = document.querySelector("#user-input");
const DIALOGUE = document.querySelector("#dialogue-div");
const VOWELS = 'aeiouy'; // also includes letter "y"
const CONSONANTS = 'bcdfghjklmnpqrstvwxz';
const HAND_BOXES = document.querySelectorAll('.hand-box');
const GAME_FIELD = document.querySelector(".game-field")
const STARTBUTTON = document.querySelector("#start-game-btn");
const INTROPAGE = document.querySelector(".intro-page");
let HANDSIZE = 10;
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
  HAND_BOXES.forEach(box => box.innerHTML = "");
  let boxNumber = 1;
  
  for (let item in hand) {
    for (let i = 1; i <= hand[item]; i++) {
      document.querySelector(`#box-${boxNumber}`)
        .innerHTML = `${item} <sub class="letter-value">${LETTER_VALUES[item]}</sub>`;
      document.querySelector(`#box-${boxNumber}`).setAttribute('style', 'display: inline');
      boxNumber++;
    } 
  }
}

function dealHand(HANDSIZE) {
  let hand = {};
  let numVowels = Math.floor(HANDSIZE / 2);

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
  
  HAND_BOXES.forEach(letter =>letter.onclick = () => {
    letter.setAttribute('style', 'background-color: grey');
    userInput.value += letter.innerText[0];
  });
  
  userInputButton.addEventListener('click', async (event) => {
    let word = await userInput.value;
    event.preventDefault();

    if (!isValidWord(word, hand, WORDS)) {
        displayHand(hand, LETTER_VALUES);
        DIALOGUE.innerHTML = "";
        DIALOGUE.innerHTML += "Invalid word, please try again.<br>";
      } else {
        total += getWordScore(word, HANDSIZE);
        DIALOGUE.innerHTML += `The word "${word}" earned ${getWordScore(word, HANDSIZE)} points.`
        TOTAL_POINTS.innerHTML =  `Total: ${total} points<br>`;
        hand = updateHand(hand, word);
        displayHand(hand, LETTER_VALUES);
      }
          
    if (calculateHandlen(hand) === 0) {
      DIALOGUE.innerHTML += "<br>Run out of letters. Total score: " + total + " points.";
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
  let handCopy = {...hand};
  let totalScore = 0;
  let handLen = calculateHandlen(hand);
  let count = 1;
  while (handLen > 7) {
    displayHand(handCopy, LETTER_VALUES);
    let word = compChooseWord(handCopy, WORDS, HANDSIZE);
    
    if (!word) {
      DIALOGUE.innerHTML += `Round ${count}: no word found`;
      break;
    } else {
      let score = getWordScore(word, HANDSIZE);
      totalScore += score
      DIALOGUE.innerHTML += `Round ${count}: ${getWordScore(word, HANDSIZE)} points for "${word}"<br>`
      TOTAL_POINTS.innerHTML = `Total: ${totalScore} points<br>`;
      handCopy = updateHand(handCopy, word);
      count++;
    }
  }
  displayHand(hand, LETTER_VALUES);
}


function playGame(WORDS) {
  let count = 0;
  let hand = dealHand(HANDSIZE);
  const controlButtons = document.querySelectorAll('.control-buttons');
  
  for (let button of controlButtons) {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const game = await button.value;
      console.log("GAME TYPE: ", game);
      switch(game) {
        case 'new':
          DIALOGUE.innerHTML = "";
          hand = dealHand(HANDSIZE);
          playHand(hand, WORDS, HANDSIZE);
          count++;
          break;
        case 'replay':
          count === 0 ?
          DIALOGUE.innerHTML = "You have not played a hand yet. Please play a new hand first!" :
          playHand(hand, WORDS, HANDSIZE);
          break;
        case 'comp':
          count === 0 ?
          DIALOGUE.innerHTML = "Please play a new game first!" :
          compPlayHand(hand, WORDS, HANDSIZE);
          break;
        case 'end':
          GAME_FIELD.setAttribute('style', 'visibility: hidden');
          INTROPAGE.setAttribute('style', 'display: initial');
          TOTAL_POINTS.innerHTML = "";
          DIALOGUE.innerHTML = "";
          document.querySelectorAll(".hand-box").forEach(item => item.innerText = "");

          return "END OF GAME";
        default:
          DIALOGUE.innerHTML = "Invalid command.";
      }  
    });
  }  
}

STARTBUTTON.addEventListener('click', async (event) => {
  event.preventDefault();
  GAME_FIELD.setAttribute('style', 'visibility: visible');
  INTROPAGE.setAttribute('style', 'display: none');
  return playGame(WORDS);
});
