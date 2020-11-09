const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

let currentlyPlaying = true;

class Field {
    constructor(field) {
        this._field = field;
        this.y = 0;
        this.x = 0;
    }

    get field() {
        return this._field;
    }

    // Print the field to the terminal as a matrix
    print() {
        return this.field.map(row =>
            row.join('')
        ).join('\n');
    }

    // This checks a users input and moves the cursor accordingly
    ask() {
        let move = prompt('Which direction would you like to move.(WASD)');
        switch(move.toLowerCase()) {
            case 'w':
                console.log('Up');
                this.y -= 1;
                break;
            case 'a':
                console.log('Down');
                this.y += 1;
                break;
            case 's':
                console.log('Left');
                this.x -= 1;
                break;
            case 'd':
                console.log('Right');
                this.x += 1;
                break;
            default:
                break;
        }    
    }

    // Detect if a player has won or lost
    checkWin() {
        // This attempts to catch the error that occurs if you go outside of the field causing the game to crash 
        // we set this to an automatic loss
        // However, this.field[0][-1] will return 'undefined' which will be capture in below switch/case
        if (this.field[this.y] == undefined) {
            console.log('You lose - Out of boundary');
            return currentlyPlaying = false;            
        }
        // This switch statement simlpy checks the different possible outcomes for when the * is moved in the chosen direction
        switch (this.field[this.y][this.x]) {
            case hole:
                console.log('You lose - You fell in a hole!');
                currentlyPlaying = false;
                break;
            case undefined:
                console.log('You lose - Out of boundary');
                currentlyPlaying = false;
                break;
            case hat:
                console.log('You win - You found the hat!');
                currentlyPlaying = false;
                break;
            case fieldCharacter:
                console.log('Keep looking for the hat...');
                this.field[this.y][this.x] = pathCharacter;
                break;
            case pathCharacter:
                console.log('You are stepping on *');
                break;
        }    
    }

    static generateField(height, width, percentage) {

        // Helper function to return hole or fieldCharacter depening on percentage.
        const fieldOrHole = (percentage) => {
            if (percentage >= 0 && percentage <= 100) {
              const ranNum = Math.random() * 100;
              if (ranNum < percentage) {
                return hole;
              } else {
                return fieldCharacter;
              }
            } else {
              console.log('Please enter a number between 0 - 100');
            }
        }

        // Helper function to return a plain field with no hat and pathCharacter
        const plainField = () => {
            function makeWidthArray() {
                let widthArray = [];
                for (let i=0; i < width; i++) {
                    widthArray.push(fieldOrHole(percentage));
                }
                return widthArray;
            }
            let plainField = [];
            for (let i=0; i < height; i++) {
                plainField.push(makeWidthArray());
            }
            return plainField;
        }

        const gameReadyField = plainField();

        // Adding hat on gameReadyField, while loop will check if hat sits on * and will reposition if so
        do {
            gameReadyField[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;
        }   while (gameReadyField[0][0] == hat);
        
        // Adding pathCharacter to left-upper corner
        gameReadyField[0][0] = pathCharacter;

        return gameReadyField;
    }

}

// This generates a new field by invoking the Field class:
// generateField() takes 3 parameters, the y-axis, the x-axis, and the percentage of holes in the field

const myField = new Field(Field.generateField(10,10,30));

function game() {
    while(currentlyPlaying) {
        console.log(myField.print());
        myField.ask();
        myField.checkWin();
    }
    console.log('Game Over!');
}

game();