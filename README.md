# Wordgame

<img align="right" src="https://storage.googleapis.com/ltkcms.appspot.com/fs/wfa/images/cover/scrabble-tiles-full-alphabet.base" width="350">

This is a web-based game app. Try to play it on [Github pages](https://dmitryyagodin.github.io/word-game/).
The game has a logic of a popular board game called *Scrabble*. In this version of the game, the player is invited to form words from a random set of 8 letters. Each letter has its own score so that the letters that typically appear less frequently in the English-language words get higher scores. The sum of letter scores is then multiplied by the number of letters used to form the word. In case the player uses all 8 letters to form a single word, the overall score gets 50 bonus points.


Currently, in the background the app is using a list of about 83,000 English-language words. This list serves as a validity check for the choices made by the player and for finding the highest scoring words in a "computer play mode."

In addition the app displays definitions for the valid words (*limited by an external API request rate*). Especially the words found by the computer may be quite rare and unknown to most people, even native speakers, which makes the game an intriguing linguistic inquiry.


## User interface
### Homepage
The game has two main views. The first one is the homepage, where the user gets a basic understanding of the game and can decide to enter ("start") the actual playing mode. The homepage shows an example to briefly describe how the scores are calculated.
<br>
The page also promises an intriguing experience of learning some "weird" words that the app will be able to show as the highest-scoring solutions. The sole UI element of the page is the glowing **START** button that is set to permanently change colors. Clicking the button updates the page so that the second of view (Game) is on and the homepage becomes hidden.
<br>

<p align="center">
  <img src="https://github.com/dmitryyagodin/word-game/blob/main/images/2021-01-31_(375x667)_homepage.png" width="300" alt="Home screen">
<p/>


### Play options 
The second view consists of several clickable buttons:
  - The **NEW** button launches the first game or updates the set of 8 random letters, if it is not the first game. The click renders random letters inside the game field.
  - At any point the player may try to play the same set of letters again by clicking the **REPLAY** button.
  - It is possible to check the best possible solution for a current set of letters with the **HINT** button. Clicking the button switches the game into a computer-play mode wherein the app automatically finds the highest-scoring words based on the current set of letters among the list of over 83,000 words (see words.js)
  - **EXIT** returns the user to the homepage and resets the gameplay 

<p align="center">
  <img src="https://github.com/dmitryyagodin/word-game/blob/main/images/new_game.PNG" width="600" alt="Play options">
<p/>


## Tools and technologies used

- HTML
- CSS
- JavaScript

Word definitions come from a rate-limited [Google Dictionary API](https://github.com/meetDeveloper/googleDictionaryAPI). When the limit is exceeded, the app stops displaying definitions.


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
