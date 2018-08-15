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

// INITIAL DICE ROLL FUNCTION TO ROLL THE DICE
yahtzeeApp.diceRoll = {
    rolled: false,
    dice: [],
    rollChance: 0,
    rollDice: function (numToRoll) {
        for (let i = 0; i < numToRoll; i++) {
            this.dice[i] = Math.floor(Math.random() * 6) + 1;
        }
    },
    sortedDice: function () {
        return this.dice.sort((a, b) => a-b);    
    }
}

//  SMALL METHOD TO TOTAL THE SUM OF THE DICE - USED FOR BOTTOM SCORES THREE OF A KIND, FOUR OF A KIND AND CHANCE
yahtzeeApp.sumDice = function (choice) {
    for (let i = 0; i < 5; i++) {
        yahtzeeApp.scoreCard[choice].value += yahtzeeApp.diceRoll.dice[i];
        yahtzeeApp.scoreCard.bottomScoreTotal += yahtzeeApp.diceRoll.dice[i];
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
    let value = 0;
        switch(selection) {
            case "one":
                value = 1;
                break;
            case "two":
                value = 2;
                break;
            case "three":
                value = 3;
                break;
            case "four":
                value = 4;
                break;
            case "five":
                value = 5;
                break;
            case "six":
                value = 6;
                break;
        }
        for (let i = 0; i < 5; i++) {
            if (yahtzeeApp.diceRoll.dice[i] === value) {
                yahtzeeApp.scoreCard[selection].value += value;
                yahtzeeApp.scoreCard.topScoreTotal += value;
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

//  EVENT LISTENER FOR A CLICK ONTO THE ROLL BUTTON
yahtzeeApp.clickRoll = function() {
    $('.roll').on('click', function(e) {
        yahtzeeApp.diceRoll.rolled = true;
        if(yahtzeeApp.diceRoll.rollChance < 3) {
            $('.dice').empty();
            yahtzeeApp.diceRoll.rollDice(5);
            const sortedRoll = yahtzeeApp.diceRoll.sortedDice();
            for(let i=0; i < 5; i++) {
                $(`.dice-${i}`).append(`<h3>${sortedRoll[i]}</h3>`);
            }
            yahtzeeApp.diceRoll.rollChance++;      
        } else {
            alert("You must pick a score to set");
        }
    });
}

//  CHECK IF THE SCORE BOX HAS ALREADY BEEN MARKED IN AND IF NOT, FILL IN THE SCORE
yahtzeeApp.clickScoreBox = function (scoreSection, scoreType) {
    if(!yahtzeeApp.diceRoll.rolled) {
        alert("Please roll your dice first!!!");
    } else {
        if (yahtzeeApp.scoreCard[scoreType].scored === false) {
            yahtzeeApp[scoreSection](scoreType);
            $(this).addClass('marked');
            $('.dice').empty();
            yahtzeeApp.diceRoll.rolled = false;
            yahtzeeApp.diceRoll.rollChance = 0;
            yahtzeeApp.scoreCard.gameRound++;
            if(yahtzeeApp.scoreCard.gameRound > 13) {
                alert("GAME OVER!!! PLEASE RESTART!!!!");
                $('.reset').removeClass('reset-hidden');

            }
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

yahtzeeApp.reset = function () {
    $('.reset').on('click', function(event) {
        document.location = "";
    });
}

yahtzeeApp.init = function () {
        yahtzeeApp.clickRoll();
        yahtzeeApp.clickTopScore();
        yahtzeeApp.clickBottomScore();
        yahtzeeApp.reset();
}

$(document).ready(function() {
        yahtzeeApp.init();
});

//  THINGS TO STILL IMPLEMENT
//  marking dice to not be re-rolled
//  make a separate re roll function 
//  dice images for dice roll
//  13 turns total -- DONE
//  3 rolls max per turn -- DONE
//  full house regex check -- DONE
//  marking scores already done to not be changed -- DONE
//  bonus top score -- DONE
//  after commiting score, clear the dice so we can't commit multiple times -- DONE