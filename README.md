# Wordgame
<img align="right" src="https://storage.googleapis.com/ltkcms.appspot.com/fs/wfa/images/cover/scrabble-tiles-full-alphabet.base" width="300">
<p>This is a web-based game app. The game has a logic of a popular board game called *Scrabble*. Here you try to form words from a random set of 8 letters.</p>
<p>Currently, the app is using a list of about 83,000 English language words. This list serves as a validity check for the choices made by the player and for finding the highest scoring words in a "computer play mode."</p> 

## User interface
The game has two main views. The first one is the homepage, where the user gets a basic understanding of the game and can decide to enter ("start") the actual playing mode.
<p align="center">
 <img align="left" src="https://github.com/dmitryyagodin/word-game/blob/main/images/2021-01-31_(375x667)_homepage.png" width="250" alt="Homepage screenshot>
</p>

The second view allows several clickable buttons: 
- play a **NEW** game that updates the set of 8 random letters and shows them in the game field
- try the same set of letters again by clicking **REPLAY**
- get the best possible solution with a **HINT** that comes up with the highest-scoring words based on the current set of letters and the list of over 83,000 words (see words.js)
- **EXIT** returns the user to the homepage and resets the gameplay 


## Tools and technologies used

- HTML
- CSS
- JavaScript

Word definitions come from a rate-limited [Google Dictionary API](https://github.com/meetDeveloper/googleDictionaryAPI). When the limit is exceeded, the app stops displaying definitions.

## Task list
- Add google dictinary api to fetch words' definitions
- Add google search links to those words that were found in the data source but didn't recieve definitions
- fix the error of being able to form a word after the hint is used

## Development Process

#### 26-Jan-2021
                  - Added google dicionary API to fetch and display definitions
#### 25-Jan-2021
                  - First working version
#### 22-Jan-2021 
                  - Added and styled an intro page (example, rules, display hidden after start button click)
                  - Added a functionality that allows clicking a letter to send to the input form (2hours)
#### 21-Jan-2021 
                  - Designed a word forming element, added a new font and improved styling of the letters (2hours) 
                  - Reworked displayHand function to output letters in separate boxes and letter values subscripted (2hours)
#### 20-Jan-2021       
                  - Added computer Play functionality to get "the best possible result" for a game
#### 18-Jan-2021       
                  - Started the project
