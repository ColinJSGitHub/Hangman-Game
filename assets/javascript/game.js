(function () {
    "use strict"; /* prevents use of undeclared variables, which will help point out if you forget to define a variable in your code
     when you look in your console*/
    var englishAlphabet, possiblewords, guessInput, guess, guessButton, lettersGuessed, lettersMatched, output;
    var livesleft, letters, lives, currentWord, numLettersMatched, messages;
    // the various variables used in the code- I only split it up because I wanted the code to appear on one line on my screen.
    function setup() {
        /* Configuration function that assigns the values for variables (available letters that you can guess aka the English alphabet, how many lives
         or chances you have, the various messages spit out when you guess a letter, the win/loss messages, etc.) */
        englishAlphabet = "abcdefghijklmnopqrstuvwxyz";
        lives = 7;
        /* decided to use some pretty awful words, hence the 7 lives. Possible words array contains multiple items*/
        possiblewords = ["bootcamp", "extension", "difficult", "infrastructure", "javascript", "intercontinental", "pepperoni", "shepherd", "computer"];

        /*created a messages object that contains all of the possible messages that I need to send with this game. win, loss, guessing a letter you already
        guessed, a response if you used an entry that wasn't a letter, etc.*/
        messages = {
            win: 'You win! Please contact the instructor for your complimentary pizza',
            lose: 'Game over! You lose. Order the class pepperoni pizza (extra cheese please). Also, #forthewatch ',
            guessed: ' No point in repeating guesses you have already made, please try again...',
            validLetter: 'That is not a letter or you entered nothing. Do you know what letters are? Please enter a letter from A-Z'
        };
        /* End of the configuration function */

        lettersGuessed = lettersMatched = '';
        numLettersMatched = 0;

        /* Chooses a word at random from the possible words array. */
        currentWord = possiblewords[Math.floor(Math.random() * possiblewords.length)];

        /* Makes #livesleft and #output blank, creates variables for later access by the functions */
        output = document.getElementById("output");
        livesleft = document.getElementById("livesleft");
        guessInput = document.getElementById("letter");

        livesleft.innerHTML = 'You have ' + lives + ' lives remaining';
        output.innerHTML = '';

        document.getElementById("letter").value = '';

        /* Ensures that the guess button is enabled */
        guessButton = document.getElementById("guess");
        guessInput.style.display = 'inline';
        guessButton.style.display = 'inline';

        /* Sets up the display for the letters in the current word- note, the word is invisible due to the css styling that makes the text  white
        on the white background of the HTML page! */
        letters = document.getElementById("letters");
        letters.innerHTML = '<li class="current-word">Current word:</li>';

        var letter, i;
        for (i = 0; i < currentWord.length; i++) {
            letter = '<li class="letter letter' + currentWord.charAt(i).toUpperCase() + '">' + currentWord.charAt(i).toUpperCase() + '</li>';
            letters.insertAdjacentHTML('beforeend', letter);
        }
    }


    /* the function for the game ending once you have met the conditions to win, aka guessing all of the letters correctly.*/
    function gameOver(win) {
        if (win) {
            output.innerHTML = messages.win;
            output.classList.add('win');
        } else {
            output.innerHTML = messages.lose;
            output.classList.add('error');
        }

        guessInput.style.display = guessButton.style.display = 'none';
        guessInput.value = '';
    }

    /* Starts the game - should ideally check for existing functions attached to window.onload. In other words, once the page loads, the setup
    function loads, which sets up your game! */
    window.onload = setup();

    /* By clicking the restart button, you trigger the setup function */
    document.getElementById("restart").onclick = setup;

    /* Resets the letter to your guess once you click the input button (enter key also works) */ /*NOTE- REVISIONS FOR AFTER HOMEWORK- CHANGE THIS TO
    an onkeyup function to avoid the problem of having to constantly type the key into the guessInput box*/
    guessInput.onclick = function () {
        this.value = '';
    };

    /* The main function for when a user clicks on the guess button.*/
    document.getElementById('hangman').onsubmit = function (e) {
        if (e.preventDefault) e.preventDefault();
        output.innerHTML = '';
        output.classList.remove('error', 'warning');
        guess = guessInput.value;

        /* Does your guess have a value? if yes continue, if no, error message is sent */
        if (guess) {
            /* Is your guess a valid letter? if so carry on, else error message sends */
            if (englishAlphabet.indexOf(guess) > -1) {
                /* has the letter been guessed (missed or matched) already? If so, abandon the current guess & add a snarky notice to the user */
                if ((lettersMatched && lettersMatched.indexOf(guess) > -1) || (lettersGuessed && lettersGuessed.indexOf(guess) > -1)) {
                    output.innerHTML = '"' + guess.toUpperCase() + '"' + messages.guessed;
                    output.classList.add("warning");
                }
                /* Does the guessed letter exist in the current word? If so, add this to the displayed letters that have already matched (by changing the
                background to green per the css sheet, reveiling the white letters). If the final letter(s) remaining in the word are added via your guess,
                trigger a game over with the win message, and make an empty promise about receiving pizza! */
                else if (currentWord.indexOf(guess) > -1) {
                    var lettersToShow;
                    lettersToShow = document.querySelectorAll(".letter" + guess.toUpperCase());

                    for (var i = 0; i < lettersToShow.length; i++) {
                        lettersToShow[i].classList.add("correct");
                    }

                    /* Checks to see if the given letter appears multiple times in the current word you are trying to identify*/
                    for (var j = 0; j < currentWord.length; j++) {
                        if (currentWord.charAt(j) === guess) {
                            numLettersMatched += 1;
                        }
                    }

                    lettersMatched += guess;
                    if (numLettersMatched === currentWord.length) {
                        gameOver(true);
                    }
                }
                /* If your guess doesn't exist in the current word and hasn't been guessed before, adds your guess to lettersGuessed, reduces lives
                 and notifies the user that they have lost a life*/
                else {
                    lettersGuessed += guess;
                    lives--;
                    livesleft.innerHTML = 'You have ' + lives + ' lives remaining';
                    if (lives === 0) gameOver();
                }
            }
            /* If you guess is not a valid letter, i.e. entering a character or a number, returns a snarky error*/
            else {
                output.classList.add('error');
                output.innerHTML = messages.validLetter;
            }
        }
        /* Otherwise, if you pressed the Guess button without actually making any input, returns an error message!*/
        else {
            output.classList.add('error');
            output.innerHTML = messages.validLetter;
        }
        return false;
    };
}());