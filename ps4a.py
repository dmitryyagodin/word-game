# The 6.00 Word Game

import random
import string
import os

VOWELS = 'aeiou'
CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
HAND_SIZE = 10
COUNT = 0

SCRABBLE_LETTER_VALUES = {
    'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1,
     'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1,
      's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
}

WORDLIST_FILENAME = "words.txt"

def loadWords():
    """
    Returns a list of valid words. Words are strings of lowercase letters.

    Depending on the size of the word list, this function may
    take a while to finish.
    """
    print("Loading word list from file...")
    # inFile: file
    inFile = open(WORDLIST_FILENAME, 'r')
    # wordList: list of strings
    wordList = []
    for line in inFile:
        wordList.append(line.strip().lower())
    print("  ", len(wordList), "words loaded.")
    return wordList

def getFrequencyDict(sequence):
    
    # freqs: dictionary (element_type -> int)
    freq = {}
    for x in sequence:
        freq[x] = freq.get(x,0) + 1
    return freq

def getWordScore(word, n):
    
    score = 0
    if n == len(word):
        score = 50
    for letter in word:
        score += SCRABBLE_LETTER_VALUES[letter] * len(word)
    return score

def displayHand(hand):
    
    try:
        if total > 0:
            updateHand(hand.word)
    except:
        for letter in hand.keys():
            for j in range(hand[letter]):
                 print(letter,end=" ")       # print all on the same line
        print()                             # print an empty line

def dealHand(n):
    
    hand={}
    numVowels = n // 3

    for i in range(numVowels):
        x = VOWELS[random.randrange(0,len(VOWELS))]
        hand[x] = hand.get(x, 0) + 1

    for i in range(numVowels, n):
        x = CONSONANTS[random.randrange(0,len(CONSONANTS))]
        hand[x] = hand.get(x, 0) + 1

    return hand


def updateHand(hand, word):
    
    hand = hand.copy()
    for i in word:
        if i in hand:
            hand[i] -= 1
            if hand[i] == 0:
                del hand[i]
    return hand

def isValidWord(word, hand, wordList):
    
    hand_copy = hand.copy()

    for i in word:
        if i in hand_copy:
            hand_copy[i] -= 1
            if hand_copy[i] == 0:
                del hand_copy[i]
        else:
            return False
    return word in wordList

def calculateHandlen(hand):
    
    return sum(vals for vals in hand.values())

def playHand(hand, wordList, n):
    total = 0

    # As long as there are still letters left in the hand:
    while calculateHandlen(hand) > 0:
        # Display the hand
        print("Current Hand: ", end =" ")
        displayHand(hand)

        # Ask user for input
        word = input('Enter word, or a "." to indicate that you are finished: ')

        # If the input is a single period:
        if word == ".":
            # End the game (break out of the loop)
            print("Goodbye! Total score: " + str(total) + " points.")
            print()

            return None
        # Otherwise (the input is not a single period):
        else:
            # If the word is not valid:
            if isValidWord(word, hand, wordList) == False:
                # Reject invalid word (print a message followed by a blank line)
                print("Invalid word, please try again.")
                print()

            # Otherwise (the word is valid):
            else:
                total += getWordScore(word, n)
                # Tell the user how many points the word earned, and the updated total score, in one line followed by a blank line
                print(word + " earned " + str(getWordScore(word, n)) +
                      " points. Total: " + str(total) + " points")
                print()
                # Update the hand
                hand = updateHand(hand, word)


    # Game is over (user entered a '.' or ran out of letters), so tell user the total score
    print()
    print("Run out of letters. Total score: " + str(total) + " points.")

def playGame(wordList):
    
    count = 0
    while True:
        game = input("Enter n to deal a new hand, r to replay the last hand, or e to end game:")
        if game == 'n':
            hand = dealHand(HAND_SIZE)
            playHand(hand, wordList, HAND_SIZE)
            count += 1
        elif game == 'r':
            if count == 0:
                print("You have not played a hand yet. Please play a new hand first!")
                print()
            else:
                playHand(hand, wordList, HAND_SIZE)
        elif game == 'e':
            break
        else:
            print("Invalid command.")
            print()

if __name__ == '__main__':
    wordList = loadWords()
    playGame(wordList)
    
