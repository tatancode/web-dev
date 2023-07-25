// Global variables

// startGame variables
const sectionAttackSelection = document.getElementById('attack-selection');
const sectionRestart = document.getElementById('reset');
const botOneButton = document.getElementById('button-bot');
const restartButton = document.getElementById('button-restart');
const botCards = document.getElementById('bot-cards');
const attackCards = document.getElementById('attackCards');

// storing selection of bot and attack sections
const sectionBotSelection = document.getElementById('bot-selection');

// storing the span element for Information Div
const spanBotPlayer = document.getElementById('player-bot');

//pcBotSelection variables
const spanPcBot = document.getElementById('pc-bot');

//Combat Variables
let playerAttack;
let playerAttacksArray = []
let pcAttacksArray = [];
let playerVictories = 0;
let pcVictories = 0;
let pcLives = 3;
let playerLives = 3;
let botOption;
let attackOption;
let pcBotAttacks;
let playerBot;
let buttons = [];
let indexPlayerAttack;
let indexPcAttack;

// declaring variables to store the bot elements 
let inputAngus
let inputDrakarisris
let inputZeus
// declaring variables to store the attack elements
let buttonFire;
let buttonWater;
let buttonEarth;
// store PC and Player's lives
const spanPlayerLives = document.getElementById('player-lives');
const spanPcLives = document.getElementById('pc-lives');

// Getting div elements for createMessages()
const result = document.getElementById('result');
const playerAttacks = document.getElementById('player-Attacks');
const pcAttacks = document.getElementById('pc-Attacks');

// variables for create final message function
const sectionMessages = document.getElementById('result');

// Defining classes
class Bot {
    constructor(name, img, lives) {
        this.name = name
        this.img = img
        this.lives = lives
        this.attacks = []
    }
}

//Instantiating Bots
let bots = []
let angus = new Bot("angus", './assets/img/Angus.gif', 5)
let drakaris = new Bot("drakaris", './assets/img/Drakaris.gif', 5)
let zeus = new Bot("zeus", './assets/img/Zeus.gif', 5)
// adding attacks to bots
angus.attacks.push(
    { name: "💦", id: 'button-water' },
    { name: "💦", id: 'button-water' },
    { name: "💦", id: 'button-water' },
    { name: "🔥", id: 'button-fire' },
    { name: "🪨", id: 'button-earth' }
)
drakaris.attacks.push(
    { name: "🪨", id: 'button-earth' },
    { name: "🪨", id: 'button-earth' },
    { name: "🪨", id: 'button-earth' },
    { name: "💦", id: 'button-water' },
    { name: "🔥", id: 'button-fire' }
)
zeus.attacks.push(
    { name: "🔥", id: 'button-fire' },
    { name: "🔥", id: 'button-fire' },
    { name: "🔥", id: 'button-fire' },
    { name: "💦", id: 'button-water' },
    { name: "🪨", id: 'button-earth' }
)

//populating bots[]
bots.push(angus, drakaris, zeus)

// Create a function that starts the game
function startGame() {
    // sets display to none 
    sectionAttackSelection.style.display = 'none';
    // dynamically populate bot cards
    bots.forEach((bot) => {
        botOption = `
        <input type="radio" name="bot" id=${bot.name}>
            <label class="bot-card" for=${bot.name}>
                <p>${bot.name}</p>
                <img src=${bot.img} alt=${bot.name} id="angus-img" class="bot-img">
            </label>
        `;
        botCards.innerHTML += botOption;
        // storing the bot button elements in variables
        inputAngus = document.getElementById('angus');
        inputDrakaris = document.getElementById('drakaris');
        inputZeus = document.getElementById('zeus');
    })

    // stores the reset button and sets display to none 
    sectionRestart.style.display = 'none';
    // calls the botSelection function
    botOneButton.addEventListener('click', botSelection);

    restartButton.addEventListener('click', restartGame);
}

// Bot Selection function
function botSelection() {

    sectionBotSelection.style.display = 'none';
    sectionAttackSelection.style.display = 'flex';

    // logic to check selected bot
    if (inputAngus.checked) {
        spanBotPlayer.innerHTML = inputAngus.id;
        playerBot = inputAngus.id;
    } else if (inputDrakaris.checked) {
        spanBotPlayer.innerHTML = inputDrakaris.id;
        playerBot = inputDrakaris.id;
    } else if (inputZeus.checked) {
        spanBotPlayer.innerHTML = inputZeus.id;
        playerBot = inputZeus.id;
    } else {
        alert("You must select a Bot to proceed");
        location.reload();
    }

    getAttacks(playerBot);
    pcBotSelection();
}

function getAttacks(playerBot) {
    let attacks
    for (let i = 0; i < bots.length; i++) {
        if (playerBot === bots[i].name) {
            attacks = bots[i].attacks;
        }
    }
    displayAttacks(attacks);
}

function displayAttacks(attacks) {
    //dynamically populate attacks
    attacks.forEach((attack) => {
        attackOption = `
        <button id=${attack.id} class="button-attack BAttack">${attack.name}</button>
        `;
        attackCards.innerHTML += attackOption;
    })
    // storing the bot radio elements 
    buttonFire = document.getElementById('button-fire');
    buttonWater = document.getElementById('button-water');
    buttonEarth = document.getElementById('button-earth');
    buttons = document.querySelectorAll('.BAttack');

}

// Attacks functions
function attackSequence() {
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥') {
                playerAttacksArray.push('FIRE');
                console.log(playerAttacksArray);
                button.style.background = '#112f58';
                button.disabled = true;
            } else if (e.target.textContent === '💦') {
                playerAttacksArray.push('WATER');
                console.log(playerAttacksArray);
                button.style.background = '#112f58';
                button.disabled = true;
            } else {
                playerAttacksArray.push('EARTH');
                console.log(playerAttacksArray);
                button.style.background = '#112f58';
                button.disabled = true;
            }
            randomAttackPc();
        })
    })
}

function pcBotSelection() {
    let randomBot = random(0, bots.length - 1);

    spanPcBot.innerHTML = bots[randomBot].name;
    pcBotAttacks = bots[randomBot].attacks;
    attackSequence();
}

function randomAttackPc() {
    let randomAttack = random(0, pcBotAttacks.length - 1);

    if (randomAttack == 0 || randomAttack == 1) {
        pcAttacksArray.push('FIRE');
    } else if (randomAttack == 3 || randomAttack == 4) {
        pcAttacksArray.push('WATER');
    } else {
        pcAttacksArray.push('EARTH');
    }
    console.log(pcAttacksArray);
    startCombat();
}

// Combat Function
function startCombat() {
    if (playerAttacksArray.length === 5) {
        combat();
    }
}

function indexAttacks(playerIndex, pcIndex) {
    indexPlayerAttack = playerAttacksArray[playerIndex];
    indexPcAttack = pcAttacksArray[pcIndex];
}
function combat() {

    for (let index = 0; index < playerAttacksArray.length; index++) {
        if (playerAttacksArray[index] === pcAttacksArray[index]) {
            indexAttacks(index, index);
            createMessage("Tie!");
        } else if (playerAttacksArray[index] === 'FIRE' && pcAttacksArray[index] === 'EARTH') {
            indexAttacks(index, index);
            createMessage('You Win');
            playerVictories++;
            spanPlayerLives.innerHTML = playerVictories;
        } else if (playerAttacksArray[index] === 'WATER' && pcAttacksArray[index] === 'FIRE') {
            indexAttacks(index, index);
            createMessage('You Win');
            playerVictories++;
            spanPlayerLives.innerHTML = playerVictories;
        } else if (playerAttacksArray[index] === 'EARTH' && pcAttacksArray[index] === 'FIRE') {
            indexAttacks(index, index);
            createMessage('You Win');
            playerVictories++;
            spanPlayerLives.innerHTML = playerVictories;
        } else {
            indexAttacks(index, index);
            createMessage("You LOST");
            pcVictories++;
            spanPcLives.innerHTML = pcVictories;
        }
        console.log(playerVictories);
        console.log(pcVictories);
    }
    livesCheck();
}
// Checking lives function
function livesCheck() {
    if (playerVictories === pcVictories) {
        createFinalMessage("Tie!");
    } else if (playerVictories > pcVictories) {
        createFinalMessage("You Won! Congratulations! ");
    } else if (pcVictories > playerVictories) {
        createFinalMessage("Game Over!...");
    }
}
// Create a message after each combat
function createMessage(combatResult) {
    // Creating paragraph elements and assigning in variables
    let newPlayerAttack = document.createElement('p');
    let newPcAttack = document.createElement('p');

    // Assigning the paragraphs to the divs
    result.innerHTML = combatResult;
    newPlayerAttack.innerHTML = indexPlayerAttack;
    newPcAttack.innerHTML = indexPcAttack;

    //result.appendChild(notification);
    playerAttacks.appendChild(newPlayerAttack);
    pcAttacks.appendChild(newPcAttack);
}
// Create a final message after Game is over
function createFinalMessage(finalResult) {

    sectionMessages.innerHTML = finalResult;


    buttonFire.disabled = true;


    buttonWater.disabled = true;


    buttonEarth.disabled = true;


    sectionRestart.style.display = 'block';
}
// Restart Game Function
function restartGame() {
    location.reload();
}
// random function
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// listening to page load to start the game
window.addEventListener('load', startGame);

