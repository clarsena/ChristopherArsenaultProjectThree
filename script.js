const yahtzeeApp = {}

// SCORE CARD OBJECT TO KEEP TRACK OF ALL THE SCORES
yahtzeeApp.scoreCard = {
    one: {
        value: 0,
        scored: false
    },
    two: {
        value: 0,
        scored: false
    },
    three: {
        value: 0,
        scored: false
    },
    four: {
        value: 0,
        scored: false
    },
    five: {
        value: 0,
        scored: false
    },
    six: {
        value: 0,
        scored: false
    },
    topScoreTotal: 0,
    bonus: 0,
    threeKind: {
        value: 0,
        scored: false
    },
    fourKind: {
        value: 0,
        scored: false
    },
    fullHouse: {
        value: 0,
        scored: false
    },
    small: {
        value: 0,
        scored: false
    },
    large: {
        value: 0,
        scored: false
    },
    yahtzee: {
        value: 0,
        scored: false
    },
    chance: {
        value: 0,
        scored: false
    },
    bottomScoreTotal: 0,
    totalScore: 0,
    gameRound: 1,
}

// DICE TRACKING OBJECT AS WELL AS DICE ROLLING AND SORTING METHODS
yahtzeeApp.diceRoll = {
    rolled: false,
    dice: [{value: 0, marked: false}, {value: 0, marked: false}, {value: 0, marked: false}, {value: 0, marked: false}, {value: 0, marked: false}],
    convertedDice: [],
    rollChance: 0,
    rollDice: function () {
        yahtzeeApp.diceRoll.dice.forEach((die) => {
            if(die.marked === false) {
                die.value = Math.floor(Math.random() * 6) + 1; 
            }
        });
        for(let i = 0; i < 5; i++) {
            yahtzeeApp.diceRoll.convertedDice[i] = yahtzeeApp.diceRoll.dice[i].value;
        }
    },
    sortedDice: function () {
        return yahtzeeApp.diceRoll.convertedDice.sort((a, b) => a-b);    
    }
}

//  SMALL METHOD TO TOTAL THE SUM OF THE DICE - USED FOR BOTTOM SCORES THREE OF A KIND, FOUR OF A KIND AND CHANCE
yahtzeeApp.sumDice = function (choice) {
    for (let i = 0; i < 5; i++) {
        yahtzeeApp.scoreCard[choice].value += yahtzeeApp.diceRoll.dice[i].value;
        yahtzeeApp.scoreCard.bottomScoreTotal += yahtzeeApp.diceRoll.dice[i].value;
    }
}

//  METHOD TO WRITES THE SCORES TO THE SCORE CARD PAGE ITSELF
yahtzeeApp.writeValues = function (section, selection) {
    const scoreTotal = `${section}ScoreTotal`;
    $(`#${section}-total-score`).empty();
    $(`#${section}-total-score`).append(`<h3>${yahtzeeApp.scoreCard[scoreTotal]}</h3>`);
    $(`#total-score-score`).empty();
    $(`#total-score-score`).append(`<h3>${yahtzeeApp.scoreCard.totalScore}</h3>`);
    $(`#${selection}`).append(`<h3>${yahtzeeApp.scoreCard[selection].value}</h3>`);
}

//  METHOD TO CALCULATE THE SCORE FOR THE TOP AREA. READS IN WHICH CATEGORY WAS CLICKED, ASSIGNS THE PROPER VALUE AND READS THROUGH THE DICES AND ADDS THEM UP APPROPRIATELY. THEN ADDS TO IT'S PROPER AREA, THE TOP SCORE AND THE TOTAL SCORE
yahtzeeApp.addTopScore = function (selection) {
    let dieValue = 0;
        switch(selection) {
            case "one":
                dieValue = 1;
                break;
            case "two":
                dieValue = 2;
                break;
            case "three":
                dieValue = 3;
                break;
            case "four":
                dieValue = 4;
                break;
            case "five":
                dieValue = 5;
                break;
            case "six":
                dieValue = 6;
                break;
        }
        for (let i = 0; i < 5; i++) {
            if (yahtzeeApp.diceRoll.dice[i].value === dieValue) {
                yahtzeeApp.scoreCard[selection].value += dieValue;
                yahtzeeApp.scoreCard.topScoreTotal += dieValue;
            }
        }
        if (yahtzeeApp.scoreCard.topScoreTotal >= 63) {
            yahtzeeApp.scoreCard.bonus = 35;
            yahtzeeApp.scoreCard.topScoreTotal += 35;
            yahtzeeApp.scoreCard.totalScore += 35;
            $('#bonus').empty();
            $('#bonus').append(`<h3>${yahtzeeApp.scoreCard.bonus}</h3>`);
        }
        yahtzeeApp.scoreCard.totalScore = yahtzeeApp.scoreCard.topScoreTotal + yahtzeeApp.scoreCard.bottomScoreTotal;
        yahtzeeApp.writeValues("top", selection)
        yahtzeeApp.scoreCard[selection].scored = true;
}

//  METHOD TO CALCULATE THE SCORE FOR THE BOTTOM AREA. READS IN WHICH CATEGORY WAS CLICKED, CHECKS IT AGAINST THE NECESSARY REGULAR EXPRESSION. THEN ADDS TO IT'S PROPER AREA, THE BOTTOM SCORE AND THE TOTAL SCORE
yahtzeeApp.addBottomScore = function (selection) {
        const diceToString = yahtzeeApp.diceRoll.sortedDice().join('');
        let testCondition = "";
        let testConditionTwo = "";
        switch (selection) {
            case "threeKind":
                testCondition = /111|222|333|444|555|666/;
                if(testCondition.test(diceToString)) {
                    yahtzeeApp.sumDice(selection);
                }
                break;
            case "fourKind":
                testCondition = /1111|2222|3333|4444|5555|6666/;
                if(testCondition.test(diceToString)) {
                    yahtzeeApp.sumDice(selection);
                }
                break;  
            case "fullHouse":
                testCondition = /(111|222|333|444|555|666)(11|22|33|44|55|66)/;
                testConditionTwo = /(11|22|33|44|55|66)(111|222|333|444|555|666)/;
                if(testCondition.test(diceToString) || testConditionTwo.test(diceToString)) {
                    yahtzeeApp.scoreCard[selection].value += 25;
                    yahtzeeApp.scoreCard.bottomScoreTotal += 25;
                }
                break;
            case "small":
                const uniqueDice = _.uniq(diceToString, true).join('');
                testCondition = /1234|2345|3456/;
                if(testCondition.test(uniqueDice)) {
                    yahtzeeApp.scoreCard[selection].value += 30;
                    yahtzeeApp.scoreCard.bottomScoreTotal += 30;
                }
                break;
            case "large":
                testCondition = /12345|23456/;
                if(testCondition.test(diceToString)) {
                    yahtzeeApp.scoreCard[selection].value += 40;
                    yahtzeeApp.scoreCard.bottomScoreTotal += 40;
                }
                break;
            case "yahtzee":
                testCondition = /11111|22222|33333|44444|55555|66666/;
                if(testCondition.test(diceToString)) {
                    alert("HOLY CRAP, YOU GOT A YAHTZEE!!!!!!");
                    yahtzeeApp.scoreCard[selection].value += 50;
                    yahtzeeApp.scoreCard.bottomScoreTotal += 50;
                }
                break;
            case "chance":
            yahtzeeApp.sumDice(selection);
                break;
        }
        yahtzeeApp.scoreCard.totalScore = yahtzeeApp.scoreCard.topScoreTotal + yahtzeeApp.scoreCard.bottomScoreTotal;
        yahtzeeApp.writeValues("bottom", selection);
        yahtzeeApp.scoreCard[selection].scored = true;
}

//  CHECK TO SEE IF THE END OF THE GAME HAS BEEN REACHED
yahtzeeApp.checkEndGame = function () {
    if(yahtzeeApp.scoreCard.gameRound > 13) {
        let closingStatement = "";
        if(yahtzeeApp.scoreCard.totalScore > 300) {
            closingStatement = "Amazing job!!! You absolutely rocked it!!!";
        } else if (yahtzeeApp.scoreCard.totalScore > 200) {
            closingStatement = "Well done!! You are really good at this game!!";
        } else if (yahtzeeApp.scoreCard.totalScore > 100) {
            closingStatement = "Not too bad, but you can use some more work.";
        } else {
            closingStatement = "You....definitely need more practice.";
        }
        alert(`The game is finished!! \nYou got a final score of ${yahtzeeApp.scoreCard.totalScore} points.\n${closingStatement}\nPlease reset the game to start again.`);
        $('.reset').removeClass('reset-hidden');
    }
}

yahtzeeApp.resetDiceImage = function(i) {
    for(let i=0; i < 5; i++) {
        $(`.dice-${i}`).removeClass (function (index, classes) {
            const classesArray = classes.split(' ');
            const removeClass = _.filter(classesArray, function(className){ return className.indexOf('die-') === 0; }).toString();
            return removeClass;
        });
    }
}

//  EVENT LISTENER FOR A CLICK ONTO THE ROLL BUTTON
yahtzeeApp.clickRoll = function() {
    $('.roll').on('click', function(e) {
        if (yahtzeeApp.scoreCard.gameRound > 13) {
            yahtzeeApp.checkEndGame();
        } else {
            yahtzeeApp.diceRoll.rolled = true;
            if(yahtzeeApp.diceRoll.rollChance < 3) {
                yahtzeeApp.diceRoll.rollDice();
                yahtzeeApp.resetDiceImage();
                for(let i=0; i < 5; i++) {
                    $(`.dice-${i}`).addClass(`die-${yahtzeeApp.diceRoll.dice[i].value}`);
                }
                yahtzeeApp.diceRoll.rollChance++;
                $('.rolls-count').text(`${yahtzeeApp.diceRoll.rollChance} / 3`);     
            } else {
                alert("You must pick a score to set");
            }
        }
    });
}

//  CHECK IF THE SCORE BOX HAS ALREADY BEEN MARKED IN AND IF NOT, FILL IN THE SCORE
yahtzeeApp.clickScoreBox = function (scoreSection, scoreType) {
    if(!yahtzeeApp.diceRoll.rolled) {
        alert("Please roll your dice first!!!");
    } else {
        $('.rolls-count').text('');
        if (yahtzeeApp.scoreCard[scoreType].scored === false) {
            yahtzeeApp[scoreSection](scoreType);
            $(`#${scoreType}`).addClass('marked');
            $('.dice').empty().removeClass('saved');
            yahtzeeApp.diceRoll.rolled = false;
            yahtzeeApp.diceRoll.rollChance = 0;
            yahtzeeApp.diceRoll.dice.forEach((die) => {
                die.marked = false;
            });
            yahtzeeApp.resetDiceImage();
            yahtzeeApp.scoreCard.gameRound++;
            $('.turns-count').text(yahtzeeApp.scoreCard.gameRound);
            yahtzeeApp.checkEndGame();
        } else {
            alert(`You have already scored your ${scoreType.toUpperCase()}. Please pick something else.`);
        }
    }
}

//  EVENT LISTENER FOR A CLICK ONTO ANY OF THE TOP SCORE BOXES TO CALCULATE THE SCORE
yahtzeeApp.clickTopScore = function () {
    $('.top-score').on('click', function(event) {
        const scoreType = $(this).attr('id');
        yahtzeeApp.clickScoreBox("addTopScore", scoreType);
    });
}

//  EVENT LISTENER FOR A CLICK ONTO ANY OF THE BOTTOM SCORE BOXES TO CALCULATE THE SCORE
yahtzeeApp.clickBottomScore = function () {
    $('.bottom-score').on('click', function(event) {
        const scoreType = $(this).attr('id');
        yahtzeeApp.clickScoreBox("addBottomScore", scoreType);
    });
}

yahtzeeApp.clickDice = function () {
    $('.dice').on('click', function(event) {
        if(yahtzeeApp.diceRoll.rolled) {
            const diceNumber = $(this).attr('id').substring(4);
            if(yahtzeeApp.diceRoll.dice[diceNumber].marked) {
                yahtzeeApp.diceRoll.dice[diceNumber].marked = false;
            } else {
                yahtzeeApp.diceRoll.dice[diceNumber].marked = true;
            }
            $(this).toggleClass('saved');
        }
    })
}

yahtzeeApp.reset = function () {
    $('.reset').on('click', function(event) {
        document.location = "";
    });
}

yahtzeeApp.init = function () {
    yahtzeeApp.clickRoll();
    yahtzeeApp.clickTopScore();
    yahtzeeApp.clickBottomScore();
    yahtzeeApp.clickDice();
    yahtzeeApp.reset();
}

$(document).ready(function() {
        yahtzeeApp.init();
});

//  THINGS TO STILL IMPLEMENT
//  labels to keep track of current turn / current roll
//  dice images for dice roll
//  marking dice to not be re-rolled -- DONE
//  make a separate re roll function -- DONE
//  13 turns total -- DONE
//  3 rolls max per turn -- DONE
//  full house regex check -- DONE
//  marking scores already done to not be changed -- DONE
//  bonus top score -- DONE
//  after commiting score, clear the dice so we can't commit multiple times -- DONE