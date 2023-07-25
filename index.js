// imports
const express = require("express");
const cors = require("cors");
// create app using express
const app = express();

// helps serve statics files(Html,css,js,etc) through an endpoint
app.use(express.static('public'));
// solve CORS related errors
app.use(cors());
// allows POST requests
app.use(express.json());

// Global variables
const players = [];

// player class
class Player {
    constructor(id) {
        this.id = id;

    }
    assignBot(bot) {
        this.bot = bot;
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    assignAttacks(attacks) {
        this.attacks = attacks;
    }
}

// bot class

class Bot {
    constructor(name) {
        this.name = name;
    }
}
// get function for /join
app.get("/join", (req, res) => {
    // generate a random user id, instantiate a player object and add it to the array of players
    const id = `${Math.random()}`;

    const player = new Player(id);

    players.push(player);

    // set a header to allow ALL origins
    res.setHeader("Access-Control-Allow-Origin", "*");

    // send user Id to caller
    res.send(id);
})

// POST bot
app.post("/bot/:playerId", (req, res) => {
    const playerId = req.params.playerId || "";
    const name = req.body.bot || "";
    const bot = new Bot(name);

    const playerIndex = players.findIndex((player) => playerId === player.id);

    if (playerIndex >= 0) {
        players[playerIndex].assignBot(bot);
    }
    console.log(players);
    console.log(playerId);
    res.end();
})

// POST coordinate & send enemies coordinates
app.post("/bot/:playerId/position", (req, res) => {
    const playerId = req.params.playerId || "";
    const x = req.body.x || 0;
    const y = req.body.y || 0;
    //console.log(`Received position update for player ${playerId}: x=${x}, y=${y}`);

    const playerIndex = players.findIndex((player) => playerId === player.id);
    if (playerIndex >= 0) {
        players[playerIndex].updatePosition(x, y);
    }

    const enemies = players.filter((player) => playerId !== player.id);

    res.send({
        enemies
    })
})
// POST attacks
app.post("/bot/:playerId/attacks", (req, res) => {
    const playerId = req.params.playerId || "";
    const attacks = req.body.attacks || [];

    console.log(`Received attacks for player ${playerId}: ${JSON.stringify(attacks)}`);

    const playerIndex = players.findIndex((player) => playerId === player.id);
    if (playerIndex === -1) {
        res.status(400).send({ error: 'No player found with id ' + playerId });
        return;
    }

    if (playerIndex >= 0) {
        players[playerIndex].assignAttacks(attacks);
    }
    res.end();
})

// adding endpoint to GET bot's attacks
app.get("/bot/:playerId/attacks", (req, res) => {
    const playerId = req.params.playerId || ""
    const player = players.find((player) => player.id === playerId)
    res.send({
        attacks: player.attacks || []
    })
})
// initiate server to listen for client's requests   
app.listen(8080, () => {
    console.log("Server on");
})



