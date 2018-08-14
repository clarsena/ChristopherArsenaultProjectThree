let diceRoll = {
    dice: [0, 0, 0, 0, 0],
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

let scoreCard = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    topScoreTotal: 0,
    bonus: 0,
    threeKind: 0,
    fourKind: 0,
    fullHouse: 0,
    small: 0,
    large: 0,
    yahtzee: 0,
    chance: 0,
    bottomScoreTotal: 0,
    totalScore: 0,
    addTopScore: function (selection, value) {
        for (let i = 0; i < 5; i++) {
            if (diceRoll.dice[i] === value) {
                this[selection] += value;
                this.topScoreTotal += value;
            }
        }
        this.totalScore+=this.topScoreTotal;
    },
    addBottomScore: function (selection) {
        const diceToString = diceRoll.sortedDice().join('');
        console.log(diceToString);
        let testCondition = "";
        switch (selection) {
            case "threeKind":
                testCondition = /111|222|333|444|555|666/;
                if(testCondition.test(diceToString)) {
                    for (let i = 0; i < 5; i++) {
                        this[selection] += diceRoll.dice[i];
                        this.bottomScoreTotal += diceRoll.dice[i];
                    }
                }
                break;
            case "fourKind":
                testCondition = /1111|2222|3333|4444|5555|6666/;
                if(testCondition.test(diceToString)) {
                    console.log("THAT IS A FOUR OF A KIND");
                    for (let i = 0; i < 5; i++) {
                        this[selection] += diceRoll.dice[i];
                        this.bottomScoreTotal += diceRoll.dice[i];
                    }
                }
                break;  
            case "small":
                testCondition = /1234|2345|3456/;
                if(testCondition.test(diceToString)) {
                    console.log("THAT IS ONE SMALL STRAIGHT");
                    this[selection] += 30;
                    this.bottomScoreTotal += 30;
                }
                break;
            case "large":
                testCondition = /12345|23456/;
                if(testCondition.test(diceToString)) {
                    this[selection] += 40;
                    this.bottomScoreTotal += 40;
                }
                break;
            case "yahtzee":
                testCondition = /11111|22222|33333|44444|55555|66666/;
                if(testCondition.test(diceToString)) {
                    console.log("HOLY CRAP, YOU GOT A YAHTZEE!!!!!!");
                    this[selection] += 50;
                    this.bottomScoreTotal += 50;
                }
                break;
            case "chance":
                for (let i = 0; i < 5; i++) {
                        this[selection] += diceRoll.dice[i];
                        this.bottomScoreTotal += diceRoll.dice[i];
                }
                break;
        }
        this.totalScore+=this.bottomScoreTotal;
    }
}

diceRoll.rollDice(5);
console.log(diceRoll.sortedDice());