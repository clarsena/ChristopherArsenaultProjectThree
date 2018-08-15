$(document).ready(function() {
    
    // INITIAL DICE ROLL FUNCTION TO ROLL THE DICE

    let diceRoll = {
        rolled: false,
        dice: [],
        rollDice: function (numToRoll) {
            for (let i = 0; i < numToRoll; i++) {
                this.dice[i] = Math.floor(Math.random() * 6) + 1;
                console.log(`Dice ${i}: ${this.dice[i]}`);
            }
        },
        sortedDice: function () {
            return this.dice.sort((a, b) => a-b);    
        }
    }

    // SCORE CARD OBJECT TO KEEP TRACK OF ALL THE SCORES

    let scoreCard = {
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

        //  SMALL METHOD TO TOTAL THE SUM OF THE DICE - USED FOR BOTTOM SCORES THREE OF A KIND, FOUR OF A KIND AND CHANCE
        sumDice: function (choice) {
            for (let i = 0; i < 5; i++) {
                this[choice].value += diceRoll.dice[i];
                this.bottomScoreTotal += diceRoll.dice[i];
            }
        },

        //  METHOD TO WRITES THE SCORES TO THE SCORE CARD PAGE ITSELF
        writeValues: function (section, selection) {
            const scoreTotal = `${section}ScoreTotal`;
            $(`#${section}-total-score`).empty();
            $(`#${section}-total-score`).append(`<h3>${this[scoreTotal]}</h3>`);
            $(`#total-score-score`).empty();
            $(`#total-score-score`).append(`<h3>${this.totalScore}</h3>`);
            $(`#${selection}`).append(`<h3>${this[selection].value}</h3>`);
        },
        
        //  METHOD TO CALCULATE THE SCORE FOR THE TOP AREA. READS IN WHICH CATEGORY WAS CLICKED, ASSIGNS THE PROPER VALUE AND READS THROUGH THE DICES AND ADDS THEM UP APPROPRIATELY. THEN ADDS TO IT'S PROPER AREA, THE TOP SCORE AND THE TOTAL SCORE
        addTopScore: function (selection) {
            if (this[selection].scored === false) {
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
                    if (diceRoll.dice[i] === value) {
                        this[selection].value += value;
                        this.topScoreTotal += value;
                    }
                }
                if (this.topScoreTotal >= 63) {
                    this.bonus = 35;
                    this.topScoreTotal += 35;
                    this.totalScore += 35;
                    $('#bonus').empty();
                    $('#bonus').append(`<h3>${this.bonus}</h3>`);
                }
                this.totalScore = this.topScoreTotal + this.bottomScoreTotal;
                this.writeValues("top", selection)
                this[selection].scored = true;
            } else {
                alert(`You have already scored your ${selection.toUpperCase()}. Please pick something else.`);
            }
        },

        //  METHOD TO CALCULATE THE SCORE FOR THE BOTTOM AREA. READS IN WHICH CATEGORY WAS CLICKED, CHECKS IT AGAINST THE NECESSARY REGULAR EXPRESSION. THEN ADDS TO IT'S PROPER AREA, THE BOTTOM SCORE AND THE TOTAL SCORE
        addBottomScore: function (selection) {
            if (this[selection].scored === false) {
                const diceToString = diceRoll.sortedDice().join('');
                let testCondition = "";
                let testConditionTwo = "";
                switch (selection) {
                    case "threeKind":
                        testCondition = /111|222|333|444|555|666/;
                        if(testCondition.test(diceToString)) {
                            this.sumDice(selection);
                        }
                        break;
                    case "fourKind":
                        testCondition = /1111|2222|3333|4444|5555|6666/;
                        if(testCondition.test(diceToString)) {
                            this.sumDice(selection);
                        }
                        break;  
                    case "fullHouse":
                        testCondition = /(111|222|333|444|555|666)(11|22|33|44|55|66)/;
                        testConditionTwo = /(11|22|33|44|55|66)(111|222|333|444|555|666)/;
                        if(testCondition.test(diceToString) || testConditionTwo.test(diceToString)) {
                            this[selection].value += 25;
                            this.bottomScoreTotal += 25;
                        }
                        break;
                    case "small":
                        const uniqueDice = _.uniq(diceToString, true).join('');
                        testCondition = /1234|2345|3456/;
                        if(testCondition.test(uniqueDice)) {
                            this[selection].value += 30;
                            this.bottomScoreTotal += 30;
                        }
                        break;
                    case "large":
                        testCondition = /12345|23456/;
                        if(testCondition.test(diceToString)) {
                            this[selection].value += 40;
                            this.bottomScoreTotal += 40;
                        }
                        break;
                    case "yahtzee":
                        testCondition = /11111|22222|33333|44444|55555|66666/;
                        if(testCondition.test(diceToString)) {
                            console.log("HOLY CRAP, YOU GOT A YAHTZEE!!!!!!");
                            this[selection].value += 50;
                            this.bottomScoreTotal += 50;
                        }
                        break;
                    case "chance":
                        this.sumDice(selection);
                        break;
                }
                this.totalScore = this.topScoreTotal + this.bottomScoreTotal;
                this.writeValues("bottom", selection);
                this[selection].scored = true;
            } else {
                alert(`You have already scored your ${selection.toUpperCase()}. Please pick something else.`);
            }
        }
    }

    //  LISTENING FOR A CLICK ONTO THE ROLL BUTTON
    $('.roll').on('click', function(e) {
        diceRoll.rolled = true;
        $('.dice').empty();
        diceRoll.rollDice(5);
        const sortedRoll = diceRoll.sortedDice();
        for(let i=0; i < 5; i++) {
            $(`.dice-${i}`).append(`<h3>${sortedRoll[i]}</h3>`);
        }      
    });

    //  LISTENING FOR A CLICK ONTO ANY OF THE TOP SCORE BOXES TO CALCULATE THE SCORE
    $('.top-score').on('click', function(event) {
        if(!diceRoll.rolled) {
            alert("Please roll your dice first!!!");
        } else {
            const scoreType = $(this).attr('id');
            console.log(`You clicked the ${scoreType} button`);
            scoreCard.addTopScore(scoreType);
            console.log(scoreCard);
            $(this).addClass('marked');
            $('.dice').empty();
            diceRoll.rolled = false;
        }
    });

    //  LISTENING FOR A CLICK ONTO ANY OF THE BOTTOM SCORE BOXES TO CALCULATE THE SCORE
    $('.bottom-score').on('click', function(event) {
        if(!diceRoll.rolled) {
            alert("Please roll your dice first!!!");
        } else {
            const scoreType = $(this).attr('id');
            console.log(`You clicked the ${scoreType} button`);
            scoreCard.addBottomScore(scoreType);
            console.log(scoreCard);
            $(this).addClass('marked');
            $('.dice').empty();
            diceRoll.rolled = false;
        }
    });

});

//  THINGS TO STILL IMPLEMENT
//  3 rolls max per turn
//  marking dice to not be re-rolled
//  make a separate re roll function 
//  dice images for dice roll
//  full house regex check -- DONE
//  marking scores already done to not be changed -- DONE
//  bonus top score -- DONE
//  after commiting score, clear the dice so we can't commit multiple times -- DONE