(function () {
    "use strict"; /* prevents use of undeclared variables, which will help point out if you forget to define a variable in your code
     when you look in your console*/
    var englishAlphabet, possiblewords, guessInput, guess, guessButton, lettersGuessed, lettersMatched, output;
    var livesleft, letters, lives, currentWord, numLettersMatched, messages;
    // the various variables used in the code- I only split it up because I wanted the code to appear on one line on my screen =]
    function setup() {
        /* Configuration function that assigns the values for variables (available letters that you can guess aka the English alphabet, how many lives
         or chances you have, the various messages spit out when you guess a letter, the win/loss messages, etc.) */
        englishAlphabet = "abcdefghijklmnopqrstuvwxyz";
        lives = 7;
        possiblewords = ["bootcamp", "extension", "difficult", "infrastructure", "javascript", "intercontinental", "pepperoni", "shepherd", "computer"];
        messages = {
            win: 'You win! Please contact the instructor for your complimentary pizza',
            lose: 'Game over! You lose. Order the class pepperoni pizza (extra cheese please) ',
            guessed: ' No point in repeating guesses you have already made, please try again...',
            validLetter: 'That is not a letter. Do you know what letters are? Please enter a letter from A-Z'
        };
        /* end configuration function */

        lettersGuessed = lettersMatched = '';
        numLettersMatched = 0;

        /* chooses a word at random from the variable */
        currentWord = possiblewords[Math.floor(Math.random() * possiblewords.length)];

        /* make #livesleft and #output blank, create variables for later access by the functions */
        output = document.getElementById("output");
        livesleft = document.getElementById("livesleft");
        guessInput = document.getElementById("letter");

        livesleft.innerHTML = 'You have ' + lives + ' lives remaining';
        output.innerHTML = '';

        document.getElementById("letter").value = '';

        /* make sure guess button is enabled */
        guessButton = document.getElementById("guess");
        guessInput.style.display = 'inline';
        guessButton.style.display = 'inline';

        /* set up display of letters in current word */
        letters = document.getElementById("letters");
        letters.innerHTML = '<li class="current-word">Current word:</li>';

        var letter, i;
        for (i = 0; i < currentWord.length; i++) {
            letter = '<li class="letter letter' + currentWord.charAt(i).toUpperCase() + '">' + currentWord.charAt(i).toUpperCase() + '</li>';
            letters.insertAdjacentHTML('beforeend', letter);
        }
    }

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

    /* Start game - should ideally check for existing functions attached to window.onload */
    window.onload = setup();

    /* buttons */
    document.getElementById("restart").onclick = setup;

    /* reset letter to guess on click */
    guessInput.onclick = function () {
        this.value = '';
    };

    /* main guess function when user clicks #guess */
    document.getElementById('hangman').onsubmit = function (e) {
        if (e.preventDefault) e.preventDefault();
        output.innerHTML = '';
        output.classList.remove('error', 'warning');
        guess = guessInput.value;

        /* does guess have a value? if yes continue, if no, error message sends */
        if (guess) {
            /* is guess a valid letter? if so carry on, else error message sends */
            if (englishAlphabet.indexOf(guess) > -1) {
                /* has the letter been guessed (missed or matched) already? if so, abandon the current guess & add notice to the user */
                if ((lettersMatched && lettersMatched.indexOf(guess) > -1) || (lettersGuessed && lettersGuessed.indexOf(guess) > -1)) {
                    output.innerHTML = '"' + guess.toUpperCase() + '"' + messages.guessed;
                    output.classList.add("warning");
                }
                /* does the guessed letter exist in current word? if so, add to the displayed letters that have already matched, if the final letter(s)
                remaining in the word are added via your guess added, trigger a game over with win message! */
                else if (currentWord.indexOf(guess) > -1) {
                    var lettersToShow;
                    lettersToShow = document.querySelectorAll(".letter" + guess.toUpperCase());

                    for (var i = 0; i < lettersToShow.length; i++) {
                        lettersToShow[i].classList.add("correct");
                    }

                    /* check to see if letter appears multiple times in the word*/
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
                /* If your guess guess doesn't exist in current word and hasn't been guessed before, add to lettersGuessed, reduce lives & notify
                the user that they have lost a life*/
                else {
                    lettersGuessed += guess;
                    lives--;
                    livesleft.innerHTML = 'You have ' + lives + ' lives remaining';
                    if (lives === 0) gameOver();
                }
            }
            /* not a valid letter, error */
            else {
                output.classList.add('error');
                output.innerHTML = messages.validLetter;
            }
        }
        /* no letter entered, error */
        else {
            output.classList.add('error');
            output.innerHTML = messages.validLetter;
        }
        return false;
    };
}());