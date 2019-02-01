/*
 * Create a list that holds all of your cards
 */
(function() {

    /**
     * Array with card classes
     */
    const cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor',
            'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb',
            'fa-diamond', 'fa-paper-plane-o', 'fa-anchor',
            'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'
        ],
        /**
         * @cfg {String} defaultCardClass
         * A base CSS class for font awesome
         */
        defaultCardClass = 'fa',

        /**
         * @cfg {String} card
         * A base CSS class for all cards
         */
        card = 'card',

        /**
         * @cfg {String} match
         * A CSS class for matched cards
         */
        match = 'match',

        /**
         * @cfg {String} open
         * A CSS classes for opening cards
         */
        open = 'open show',

        /**
         * @cfg {Integer} gameMaxDuration
         * Maximal game duration
         */
        gameMaxDuration = 180;



    // Global variables for game 

    /**
     * @property {DOMElement} openedCard1
     * First opened card
     */
    let openedCard1 = false,

        /**
         * @property {DOMElement} openedCard2
         * Second opened card
         */
        openedCard2 = false,

        /**
         * @property {Integer} stepCounter
         * Amount of steps
         */
        stepCounter = 0,

        /**
         * @property {Integer} cardCounter
         * Amount of opened cards
         */
        cardCounter = 0,

        /**
         * @property {Boolean} gameInProcess
         * Current game status
         */
        gameInProcess = false,

        /**
         * @property {Object} time
         * Timer variable to assign setInterval function 
         */
        timerInterval = null,

        /**
         * @property {Integer} time
         * Current game time
         */
        time = 0;


    /**
     * @description Get elements with a given query selector.
     * @param {String} query Query selector.
     * @return {Array} Array of elements.
     */
    function getElements(query) {
        return document.querySelectorAll(query);
    }


    /**
     * @description Shuffle cards for game
     * @param {Array/String} array Array of cards to shuffle.
     * @return {Array/String} Array with shuffled cards.
     */
    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        let currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    /**
     * @description Toggle given class using cross browser property ClassName.
     * @param {Object} element DOMElement to toggle class.
     * @param {String} className Class name that should be toggled.
     */
    // toggleClass function from https://stackoverflow.com/questions/18880890/how-do-i-toggle-an-elements-class-in-pure-javascript
    function toggleClass(element, className) {
        if (!element || !className) {
            return;
        }

        var classString = element.className,
            nameIndex = classString.indexOf(className);
        if (nameIndex == -1) {
            classString += ' ' + className;
        } else {
            classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
        }
        element.className = classString;
    }


    /**
     * @description Check is clicked element is the needed target or not
     * @param {TouchEvent|MouseEvent}
     * @param {String} targetClass Target element class
     * @return {Boolean} return True if clicked element has targetClass, 
     * otherwise return false
     */
    function isTargetElement(event, targetClass) {
        if (event.target.className.indexOf(targetClass) > -1) {
            return true;
        }
        return false;
    }

    /**
     * @description Hide stars depends of the step number.
     */
    function starRating() {
        let stars = getElements('.stars .fa-star');
        if (stars && stars.length > 0) {
            if (stepCounter > 50 && stars.length === 2) {
                toggleClass(stars[1], 'fa-star');
            } else if (stepCounter > 40 && stars.length === 3) {
                toggleClass(stars[2], 'fa-star');
            }
        }
    }



    /**
     * @description Show all stars for new game.
     */
    function resetStars() {
        let stars = getElements('.stars i');

        for (let i = 0, len = stars.length; i < len; i++) {
            stars[i].className = 'fa fa-star';
        }
    }

    /**
     * @description Check is the one of the cards already opened. 
     * If not, add the DOMElement of opened card to one of the global game variable openedCard.
     * If second card was added, after 3 seconds call isMatch function.
     * @param {DOMElement} card1 First opened card
     * @param {DOMElement} card2 Second opened car
     */
    function cardCheck(targetElement) {
        if (openedCard1 === false) {
            openedCard1 = targetElement;
        } else if (openedCard2 === false) {
            openedCard2 = targetElement;
            setTimeout(function() {
                isMatch(openedCard1, openedCard2);
            }, 300)
        };
    }


    /**
     * @description Check two cards. If both cards have the same icons will be added CSS class 'match', 
     * otherwise close both cards.
     * @param {DOMElement} card1 First opened card
     * @param {DOMElement} card2 Second opened car
     */
    function isMatch(card1, card2) {
        if (card1.children[0].className === card2.children[0].className) {
            card1.className = `${card} ${match}`;
            card2.className = `${card} ${match}`;
            openedCard1 = false;
            openedCard2 = false;
            play = true;
            console.log('Match');
            cardCounter += 2;
            if (cardCounter === 16) {
                gameEnd(true);
            }
        } else {
            card1.className = `${card}`;
            card2.className = `${card}`;
            openedCard1 = false;
            openedCard2 = false;
            play = true;
            console.log('Not Match');
        }
    }


    /**
     * @description Close all opened cards and call function resetStars.
     */
    function resetCards() {
        let allCards = getElements('.deck .card');

        for (let i = 0, len = allCards.length; i < len; i++) {
            allCards[i].className = `${card}`;
        }
    }


    /**
     * @description Show modal window with results of game.
     */
    function showModalWindow() {
        let stars = getElements('.stars .fa-star').length;
        // If passed time is less than maximal game duration, will be showen Congratulation modal window.
        if (time < gameMaxDuration) {
            getElements('.resultText')[0].textContent = `Congratulations`;
            getElements('.resultStars')[0].textContent = `You got ${stars} stars rating.`;
            getElements('.resultSteps')[0].textContent = `You've made ${stepCounter} steps.`;
            getElements('.resultTime')[0].textContent = `Game time is ${time} seconds.`;
            setTimeout(function() {
                toggleClass(getElements('.modalBox')[0], 'modalBox__active');
            }, 100)
            // If passed time is more or equal to maximal game duration, will be showen modal window 'time's up'.
        } else {
            getElements('.resultText')[0].textContent = `Sorry, time's up.`;
            setTimeout(function() {
                toggleClass(getElements('.modalBox')[0], 'modalBox__active');
            }, 100)
        }
    }


    /**
     * @description Close modal window with results of game.
     */
    function closeModalWindow() {
        if (getElements('.modalBox')[0].className.indexOf('modalBox__active') > -1) {
            toggleClass(getElements('.modalBox')[0], 'modalBox__active');
        }
    }


    /**
     * @description Reset all game. Call resetCards, resetStars. 
     * If game in process will be called gameEnd to stop timer.
     * In case that restart button will be clicked on active modal window, this window will be hide.
     */
    function resetGame() {
        resetCards();
        resetStars();
        setTimeout(setShuffledClasses(), 300)
        openedCard1 = false;
        openedCard2 = false;
        stepCounter = 0;
        cardCounter = 0;

        if (gameInProcess === true) {
            gameEnd(false);
        }

        getElements('.score-panel .moves')[0].textContent = 0;
        getElements('.score-panel .timePass')[0].textContent = 0;

        closeModalWindow();
    }


    /**
     * @description Call shuffle function and add new shuffled classes to cards.
     */
    function setShuffledClasses() {
        let shuffled = shuffle(cards),
            targetCards = getElements('.card i');

        for (let i = 0, len = targetCards.length; i < len; i++) {
            targetCards[i].className = `${defaultCardClass} ${shuffled[i]}`;
        };
    }


    /**
     * @description Clear timer, set game process equal to false.
     * In case that time is up, will be called showModalWindow. After that reset passed time.
     * @param {Boolean} showModal If true, modal window will be showed.
     */
    function gameEnd(showModal) {
        clearInterval(timerInterval)
        gameInProcess = false;
        if (showModal) {
            showModalWindow();
        }
        time = 0;
    }


    /**
     * @description Create timer with setInterval.
     */
    function gameStart() {
        gameInProcess = true;
        timerInterval = setInterval(function() {
            if (time < gameMaxDuration) {
                time += 1;
                getElements('.score-panel .timePass')[0].textContent = time;
                // console.log(time);
            } else {
                gameEnd(true);
            }
        }, 1000);
    }


    /**
     * @description Main function called when click or touch event is fired.
     */
    function gameMain(event) {
        let targetElement = event.target;

        if (targetElement.className.indexOf('repeat') > -1) {
            resetGame();
        }

        if (isTargetElement(event, 'closeModal')) {
            closeModalWindow();
        }

        if (isTargetElement(event, 'card') && !isTargetElement(event, 'match') && !isTargetElement(event, 'open')) {
            if (gameInProcess === false) {
                gameStart();
            }
            targetElement.className = `${card} ${open}`;
            stepCounter += 1;
            getElements('.score-panel .moves')[0].textContent = stepCounter;
            starRating();
            cardCheck(targetElement);
        }
    }


    /**
     * @description Check is fired event is touch or click.
     */
    var hasTouchStartEvent = 'ontouchstart' in document.createElement('div');

    setShuffledClasses();

    document.addEventListener(hasTouchStartEvent ? 'touchend' : 'click', function(e) {
        if (openedCard2 === false) {
            gameMain(event);
        }
    });
})();