// Global variables

// startGame variables
const sectionAttackSelection = document.getElementById('attack-selection');
const sectionRestart = document.getElementById('reset');
const botOneButton = document.getElementById('button-bot');
const restartButton = document.getElementById('button-restart');
const botCards = document.getElementById('bot-cards');
const attackCards = document.getElementById('attackCards');
const sectionCanva = document.getElementById('canva');
const map = document.getElementById('map');
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
let playerBotObject;
let pcBotObject;
let playerId;
let enemyId;
let enemyBotsArray = [];
// map variables
let canvas = map.getContext("2d");
let interval;
let mapBackground = new Image();
mapBackground.src = './assets/img/botmap.png';
let desiredHeight;
let mapWidth = window.innerWidth - 20;
const maxMapWidth = 700;
if (mapWidth > maxMapWidth) {
    mapWidth = maxMapWidth;
}

desiredHeight = mapWidth * 600 / 800;
map.width = mapWidth;
map.height = desiredHeight;


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
    constructor(name, img, lives, id = null) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.lives = lives;
        this.attacks = [];
        this.width = 80;
        this.height = 80;
        this.x = random(0, map.width - this.width);
        this.y = random(0, map.height - this.height);
        this.botMapPic = new Image();
        this.botMapPic.src = img;
        this.speedX = 0;
        this.speedY = 0;

    }

    drawBot() {
        canvas.drawImage(
            this.botMapPic,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

//Instantiating Bots
let bots = []
let angus = new Bot("angus", './assets/img/Angus.gif', 5)
let drakaris = new Bot("drakaris", './assets/img/Drakaris.gif', 5)
let zeus = new Bot("zeus", './assets/img/Zeus.gif', 5)

// Instantiating pc Bots
let pcBotsArray = []
// adding attacks to bots
const angusAtacksArray = [
    { name: "💦", id: 'button-water' },
    { name: "💦", id: 'button-water' },
    { name: "💦", id: 'button-water' },
    { name: "🔥", id: 'button-fire' },
    { name: "🪨", id: 'button-earth' }
]
angus.attacks.push(...angusAtacksArray);

const drakarisAttacksArray = [

    { name: "🪨", id: 'button-earth' },
    { name: "🪨", id: 'button-earth' },
    { name: "🪨", id: 'button-earth' },
    { name: "💦", id: 'button-water' },
    { name: "🔥", id: 'button-fire' }
]
drakaris.attacks.push(...drakarisAttacksArray);

const zeusAttacksArrays = [
    { name: "🔥", id: 'button-fire' },
    { name: "🔥", id: 'button-fire' },
    { name: "🔥", id: 'button-fire' },
    { name: "💦", id: 'button-water' },
    { name: "🪨", id: 'button-earth' }
]
zeus.attacks.push(...zeusAttacksArrays);


//populating bots arrays
bots.push(angus, drakaris, zeus);
// pcBotsArray.push(angusPc, drakarisPc, zeusPc);
// Create a function that starts the game
function startGame() {
    // sets display to none 
    sectionAttackSelection.style.display = 'none';
    sectionCanva.style.display = 'none';
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

    // Calls the function that requests user Id from API
    joinGame();
}
// Join Game function (call to API)
function joinGame() {
    // starts process of fetching a resource from the network 
    // if there's no HTTP errors, cast the response to string 
    fetch("http://localhost:8080/join")
        .then(function (res) {

            if (res.ok) {
                res.text()
                    .then(function (response) {
                        playerId = response;
                    })
            }
        })
}
// Bot Selection function
function botSelection() {
    sectionBotSelection.style.display = 'none';
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

    // call function to send Bot to API
    saveBot(playerBot);

    getAttacks(playerBot);
    sectionCanva.style.display = 'flex';
    startMap();
}
// saves Bot object to send it to API
function saveBot(playerBot) {
    fetch(`http://localhost:8080/bot/${playerId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bot: playerBot
        })
    })
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
    // storing the attack button elements 
    buttonFire = document.getElementById('button-fire');
    buttonWater = document.getElementById('button-water');
    buttonEarth = document.getElementById('button-earth');
    buttons = document.querySelectorAll('.BAttack');

}

// Attacks functions
function attackSequence() {
    console.log("Attack sequence");
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥') {
                playerAttacksArray.push('FIRE');
                console.log("fire");
                button.style.background = '#112f58';
                button.disabled = true;
            } else if (e.target.textContent === '💦') {
                playerAttacksArray.push('WATER');
                console.log("water");
                button.style.background = '#112f58';
                button.disabled = true;
            } else {
                playerAttacksArray.push('EARTH');
                console.log("earth");
                button.style.background = '#112f58';
                button.disabled = true;
            }

            if (playerAttacksArray.length === 5) {
                console.log(playerAttacksArray, "attacks added to array");
                sendAttacks();
            }
        })
    })
    console.log("attacks array length: ", playerAttacksArray.length);
}
// function to send attacks to API
function sendAttacks() {
    fetch(`http://localhost:8080/bot/${playerId}/attacks`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            attacks: playerAttacksArray
        })
    })
    console.log("Attacks sent to server-side");
    interval = setInterval(getAttacksApi, 50);
}

// function to get enemies attacks
function getAttacksApi() {
    console.log("getAttacksApi()");
    fetch(`http://localhost:8080/bot/${enemyId}/attacks`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ attacks }) {
                        if (attacks.length === 5) {
                            pcAttacksArray = attacks;
                            console.log("PC Attacks Array", pcAttacksArray);
                            startCombat();
                        }
                    })
            }
        })
}

function pcBotSelection(enemy) {
    console.log("pcBotSelection(enemy)")
    spanPcBot.innerHTML = enemy.name;
    pcBotAttacks = enemy.attacks;
    console.log(pcBotAttacks);
    attackSequence();
}

function pcAttackSequence() {
    let randomAttack = random(0, pcBotAttacks.length - 1);
    if (pcBotAttacks[randomAttack].name == '🔥') {
        pcAttacksArray.push('FIRE');
    } else if (pcBotAttacks[randomAttack].name == '💦') {
        pcAttacksArray.push('WATER');
    } else {
        pcAttacksArray.push('EARTH');
    }
    console.log("pcAttackSequence()")
    //startCombat();
}

// Combat Function
function startCombat() {
    console.log("startCombat()");
    if (playerAttacksArray.length === 5) {
        combat();
    }
}

function indexAttacks(playerIndex, pcIndex) {
    indexPlayerAttack = playerAttacksArray[playerIndex];
    indexPcAttack = pcAttacksArray[pcIndex];
}
// function combat() {
//     clearInterval(interval);
//     console.log("combat");
//     for (let index = 0; index < playerAttacksArray.length; index++) {
//         if (playerAttacksArray[index] === pcAttacksArray[index]) {
//             indexAttacks(index, index);
//             createMessage("Tie!");
//         } else if (playerAttacksArray[index] === 'FIRE' && pcAttacksArray[index] === 'EARTH') {
//             indexAttacks(index, index);
//             createMessage('You Win');
//             playerVictories++;
//             spanPlayerLives.innerHTML = playerVictories;
//         } else if (playerAttacksArray[index] === 'WATER' && pcAttacksArray[index] === 'FIRE') {
//             indexAttacks(index, index);
//             createMessage('You Win');
//             playerVictories++;
//             spanPlayerLives.innerHTML = playerVictories;
//         } else if (playerAttacksArray[index] === 'EARTH' && pcAttacksArray[index] === 'FIRE') {
//             indexAttacks(index, index);
//             createMessage('You Win');
//             playerVictories++;
//             spanPlayerLives.innerHTML = playerVictories;
//         } else if (playerAttacksArray[index] === 'EARTH' && pcAttacksArray[index] === 'WATER') {
//             indexAttacks(index, index);
//             createMessage('You Win');
//             playerVictories++;
//             spanPlayerLives.innerHTML = playerVictories;
//         } else {
//             indexAttacks(index, index);
//             createMessage("You LOST");
//             pcVictories++;
//             spanPcLives.innerHTML = pcVictories;
//         }

//     }
//     livesCheck();
// }
// refactored combat()
function combat() {
    clearInterval(interval);
    console.log("Entering combat");
    console.log("Player attacks array: ", playerAttacksArray);
    console.log("PC attacks array: ", pcAttacksArray);

    const winMapping = {
        'FIRE': 'EARTH',
        'EARTH': 'WATER',
        'WATER': 'FIRE'
    };


    for (let index = 0; index < playerAttacksArray.length; index++) {
        // Grabbing the current attack for both the player and the PC.
        const playerAttack = playerAttacksArray[index];
        const pcAttack = pcAttacksArray[index];

        // Logging the current round number.
        console.log("Starting round ", index + 1);

        // Checking if both the player and the PC have chosen the same attack.
        if (playerAttack === pcAttack) {
            // In the event of the same attack choice, it's a tie.
            indexAttacks(index, index);
            createMessage("Tie!");
            console.log(playerAttack, "vs ", pcAttack);
        }
        // Checking if the player's attack beats the PC's attack using the winMapping.
        else if (Array.isArray(winMapping[playerAttack]) ? winMapping[playerAttack].includes(pcAttack) : winMapping[playerAttack] === pcAttack) {
            // If the player's attack beats the PC's attack, player wins.
            indexAttacks(index, index);
            createMessage('You Win');
            playerVictories++;  // Increment the player's victory count.
            console.log(playerAttack, "vs ", pcAttack);
            spanPlayerLives.innerHTML = playerVictories;
        }
        // If neither of the above conditions met, it means the PC's attack beats the player's attack.
        else {
            // Player loses the round.
            indexAttacks(index, index);
            createMessage("You LOST");
            pcVictories++;  // Increment the PC's victory count.
            console.log(pcAttack, "vs ", playerAttack);
            spanPcLives.innerHTML = pcVictories;
        }

        // Logging the current victory count for both the player and the PC.
        console.log("Player Victories: ", playerVictories);
        console.log("PC Victories: ", pcVictories);
    }

    console.log("Exiting combat");
    livesCheck();
}

// Checking lives function
function livesCheck() {
    if (playerVictories === pcVictories) {
        createFinalMessage("Tie!");
    } else if (playerVictories > pcVictories) {
        createFinalMessage("You Won! Congratulations! ");
    } else if (pcVictories > playerVictories) {
        createFinalMessage("You Lost! Game Over!...");
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

function drawCanvas() {
    // creating smaller image of Bot to display on canvas
    console.log("drawCanvas()");
    playerBotObject.x = playerBotObject.x + playerBotObject.speedX;
    playerBotObject.y = playerBotObject.y + playerBotObject.speedY;

    canvas.clearRect(0, 0, map.width, map.height);
    canvas.drawImage(
        mapBackground,
        0,
        0,
        map.width,
        map.height
    );
    playerBotObject.drawBot();

    // call function that sends POST request to update position
    sendPosition(playerBotObject.x, playerBotObject.y);

    enemyBotsArray.forEach(function (bot) {
        if (bot != undefined) {
            bot.drawBot();
            reviewCollision(bot);
        }
    })
}

// function to send POST request to API to send coordinates
function sendPosition(x, y) {
    fetch(`http://localhost:8080/bot/${playerId}/position`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ enemies }) {
                        enemyBotsArray = enemies.map(function (enemy) {

                            let enemyBotObj = null;
                            if (enemy.bot != undefined) {
                                const botName = enemy.bot.name || "";
                                if (botName === "angus") {
                                    enemyBotObj = new Bot("angus", './assets/img/Angus.gif', 5, enemy.id);
                                } else if (botName === "drakaris") {
                                    enemyBotObj = new Bot("drakaris", './assets/img/Drakaris.gif', 5, enemy.id);
                                } else if (botName === "zeus") {
                                    enemyBotObj = new Bot("zeus", './assets/img/Zeus.gif', 5, enemy.id);
                                }

                                enemyBotObj.x = enemy.x;
                                enemyBotObj.y = enemy.y;

                                return enemyBotObj;
                            }

                        })
                    })
            }
        })
}
function moveUp() {
    playerBotObject.speedY = -5
}
function moveDown() {
    playerBotObject.speedY = 5
}
function moveLeft() {
    playerBotObject.speedX = -5
}
function moveRight() {
    playerBotObject.speedX = 5
}
function stopMovement() {
    playerBotObject.speedX = 0;
    playerBotObject.speedY = 0;
}
function arrowKey(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            break;
    }
}

function startMap() {
    playerBotObject = getBotObject(playerBot);
    // interval that calls drawCanvas function every 50 ms
    interval = setInterval(drawCanvas, 50);
    window.addEventListener('keydown', arrowKey);
    window.addEventListener('keyup', stopMovement);
}

function getBotObject(bot) {
    for (let i = 0; i < bots.length; i++) {
        if (bot === bots[i].name) {
            return bots[i];
        }
    }
}
function getPcBotObject(pcBot) {
    for (let i = 0; i < pcBotsArray.length; i++) {
        if (pcBot === pcBotsArray[i].name) {
            return pcBotsArray[i];
        }
    }
}

function reviewCollision(enemy) {
    console.log("Review collision");
    const topPcBot = enemy.y;
    const bottomPcBot = enemy.y + enemy.height;
    const rightPcBot = enemy.x + enemy.width;
    const leftPcBot = enemy.x;

    const topPlayerBot = playerBotObject.y;
    const bottomPlayerBot = playerBotObject.y + playerBotObject.height;
    const rightPlayerBot = playerBotObject.x + playerBotObject.width;
    const leftPlayerBot = playerBotObject.x;
    if (
        bottomPlayerBot < topPcBot ||
        topPlayerBot > bottomPcBot ||
        rightPlayerBot < leftPcBot ||
        leftPlayerBot > rightPcBot
    ) {
        return;
    }
    stopMovement();
    clearInterval(interval);

    enemyId = enemy.id;
    sectionAttackSelection.style.display = 'flex';
    sectionCanva.style.display = 'none';
    pcBotSelection(enemy);
}
// listening to page load to start the game
window.addEventListener('load', startGame);

