// Wordgame reworked from the python code ps4a.py and ps4b.py
import WORDS from "./words.js"; // this data includes over 83,000 valid English langauge words
const userInputButton = document.querySelector("#user-input-btn");
const TOTAL_POINTS = document.querySelector("#total-points");
const userInput = document.querySelector("#user-input");
const DIALOGUE = document.querySelector("#dialogue-div");
const VOWELS = 'aeiouy'; // note that vowels also include letter "y"
const CONSONANTS = 'bcdfghjklmnpqrstvwxz';
const HAND_BOXES = document.querySelectorAll('.hand-box');
const BOX_DIV = document.querySelector(".display-hand-boxes");
const CHECK_DIV = document.querySelector("#check-user-input");
const GAME_FIELD = document.querySelector(".game-field")
const STARTBUTTON = document.querySelector("#start-game-btn");
const HOME_PAGE = document.querySelector(".home-page");
const HANDSIZE = 8;
const LETTER_VALUES = {
  'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1,
   'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1,
    's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
}

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
  let handAsString = "";

  for (let item in hand) {
    for (let i = 1; i <= hand[item]; i++) {
      document.querySelector(`#box-${boxNumber}`)
        .innerHTML = `${item} <sub>${LETTER_VALUES[item]}</sub>`;
      document.querySelector(`#box-${boxNumber}`).setAttribute('style', 'display: inline');
      handAsString += item;
      boxNumber++;
    } 
  }
  HAND_BOXES.forEach(box => {
    if (!box.innerHTML) {
      box.setAttribute('style', 'visibility: hidden');
    }
  });
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
  word = word.toLowerCase();
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
  DIALOGUE.innerHTML = "";
  TOTAL_POINTS.innerHTML = "";
  userInput.value = "";
  let total = 0;
  let handCopy = {...hand};
  displayHand(handCopy, LETTER_VALUES);
  
  HAND_BOXES.forEach(letter =>letter.onclick = () => {
    userInput.value += letter.innerText[0];
    letter.setAttribute('style', 'visibility: hidden');
  });

  userInputButton.onclick = () => {
    let word = userInput.value.toLowerCase();
    
    if (!isValidWord(word, handCopy, WORDS)) {
      displayHand(handCopy, LETTER_VALUES);
      DIALOGUE.innerHTML = "";
      DIALOGUE.innerHTML += "Invalid word, please try again.<br>";
    } 
    
    else {
      total += getWordScore(word, HANDSIZE);
      DIALOGUE.innerHTML = `Yes! It's a word.<br>${getWordScore(word, HANDSIZE)} points for <em>"${word}"</em><br>`
      getDefinition(word);
      TOTAL_POINTS.innerHTML =  `<br>Total: ${total} points<br>`;
      handCopy = updateHand(handCopy, word);
      displayHand(handCopy, LETTER_VALUES);
    }

    if (calculateHandlen(hand) === 0) {
      DIALOGUE.innerHTML += "<br>Run out of letters. Total score: " + total + " points.";
    }
    userInput.value = "";
  }
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
  let count = 0;
  DIALOGUE.innerHTML = "The best solution: <br><br>";
  while (handLen > 7) {
    displayHand(handCopy, LETTER_VALUES);
    let word = compChooseWord(handCopy, WORDS, HANDSIZE);
    
    if (word) {
      let score = getWordScore(word, HANDSIZE);
      totalScore += score
      DIALOGUE.innerHTML += `${getWordScore(word, HANDSIZE)} points for <em>"${word}"</em><br>`
      getDefinition(word);
      TOTAL_POINTS.innerHTML = `<br>Total: ${totalScore} points<br>`;
      handCopy = updateHand(handCopy, word);
      count++;
    } else {
      break;      
    }
  }
  if (count === 0) {
    DIALOGUE.innerHTML = "No words found, try new letters";
  }

  displayHand(hand, LETTER_VALUES);
}


function playGame(WORDS) {
  let count = 0;
  let hand = dealHand(HANDSIZE);
  const CONTROLS = document.querySelectorAll('.control-buttons');
  
  for (let button of CONTROLS) {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      let game = await button.value;
      displayHand(hand, LETTER_VALUES);
      
      switch(game) {
        case 'new':
          hand = dealHand(HANDSIZE)
          playHand(hand, WORDS, HANDSIZE);
          BOX_DIV.setAttribute('style', 'visibility: visible');
          CHECK_DIV.setAttribute('style', 'visibility: visible');
          count++;
          break;
        case 'replay':
          count === 0 ?
          DIALOGUE.innerHTML = "You have not played a hand yet.<br>Please play a new hand first!" :
          playHand(hand, WORDS, HANDSIZE);
          break;
        case 'comp':
          count === 0 ?
          DIALOGUE.innerHTML = "Please play a new game first!" :
          compPlayHand(hand, WORDS, HANDSIZE);
          break;
        case 'end':
          GAME_FIELD.setAttribute('style', 'visibility: hidden');
          BOX_DIV.setAttribute('style', 'visibility: hidden');
          CHECK_DIV.setAttribute('style', 'visibility: hidden');
          TOTAL_POINTS.innerHTML = "";
          DIALOGUE.innerHTML = "";
          HOME_PAGE.setAttribute('style', 'display: inline');
          HAND_BOXES.forEach(item => item.innerText = "");
          break;
        default:
          DIALOGUE.innerHTML = "Invalid command.";
      }  
    });
  }  
}

function getDefinition(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
  .then(response => response.json())
  .then(definition => {
    const wordDefinition = definition[0].meanings[0].definitions[0].definition;
    const reference = "(source: <i>Oxford Languages and Google</i>)";
    DIALOGUE.innerHTML += `<br>"${word}" means: <blockquote>"${wordDefinition}"</blockquote><span class="reference">${reference}</span><br><br>`
  });
  
}

// Wait for the button click to start the game
// Turn off the intro page and display the game field
STARTBUTTON.addEventListener('click', async (event) => {
  event.preventDefault();
  HOME_PAGE.setAttribute('style', 'display: none');
  GAME_FIELD.setAttribute('style', 'display: flex');
  return playGame(WORDS);
});
