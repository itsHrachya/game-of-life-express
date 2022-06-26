const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");

const CreaturesManager = require('./classes/util/CreaturesManager');
const GameData = require("./classes/util/GameData");
const SeasonTheme = require('./classes/util/Season');
const GameManager = require('./classes/util/GameManager');

const createMatrix = require('./classes/util/MatrixGenerator');

gameData = new GameData();
creatures = new CreaturesManager();
matrix = [];

seasonIndex = 0;
seasonName = "Spring";

seasonThemes = [
    new SeasonTheme("#0ac900", "#e1ff00", "#ff0066", "#0341fc", "#fc7703", "#690000"),
    new SeasonTheme("#03a800", "#6ead00", "#fc0303", "#1226ff", "#fc7703", "#690000"),
    new SeasonTheme("#b3ee3a", "#f4fc03", "#db0016", "#034efc", "#fc7703", "#690000"),
    new SeasonTheme("#fff0f0", "#f4fc03", "#b50012", "#0318fc", "#fc7703", "#690000")
];

gameManagers = [
    new GameManager(2, 30, 3, 2, 1),
    new GameManager(3, 25, 2, 4, 2),
    new GameManager(1, 20, 1, 6, 3),
    new GameManager(0, 20, 2, 4, 0)
];

app.use(express.static("."));

app.get('/', function (req, res) {
    res.redirect('./index.html');
});

server.listen(3000, function () {
    console.log("Server has started.")
});

global.getSeasonTheme = function () {
    return seasonThemes[seasonIndex];
}

global.getGameManager = function () {
    return gameManagers[seasonIndex];
}

io.on('connection', function (socket) {
    createMatrix(60, 100, 30, 20, 1, 5, 2);
    socket.on("restart", restart);
    socket.on("addGrass", addGrass);
    socket.on("addGrassEater", addGrassEater);
    socket.on("addPredator", addPredator);
    socket.on("changeSeason", changeSeason);
});

function restart() {

    gameData = new GameData();
    creatures.resetData();
    seasonIndex = 0;
    seasonName = "Spring";

    createMatrix(60, 100, 30, 20, 1, 5, 2);

    game();

    let data = {
        matrix: matrix,
        gameData: gameData,
        creatures: creatures,
        chartForm: creatures.getChartForm(),
        seasonTheme: global.getSeasonTheme(),
        seasonName: seasonName
    };

    io.sockets.emit("matrix", data);

    console.log("Game Restarted.");

}

function addGrass() {
    creatures.addGrassCreature(10);
}

function addGrassEater() {
    creatures.addGrassEaterCreature(10);
}

function addPredator() {
    creatures.addPredatorCreature(10);
}

function game() {

    creatures.start();

    let data = {
        matrix: matrix,
        gameData: gameData,
        creatures: creatures,
        chartForm: creatures.getChartForm(),
        seasonTheme: global.getSeasonTheme(),
        seasonName: seasonName
    };

    io.sockets.emit("matrix", data);

}

function writeStatistics() {
    fs.writeFile("statistics.json", JSON.stringify(gameData), function () {
        console.log("Statistics Updated.");
    });
}

function changeSeason() {
    seasonIndex++
    if (seasonIndex >= seasonThemes.length) seasonIndex = 0;
    seasonName = "Spring";
    if (seasonIndex == 1) seasonName = "Summer";
    if (seasonIndex == 2) seasonName = "Autumn";
    if (seasonIndex == 3) seasonName = "Winter";
    console.log("Season Changed To " + seasonName);
}

setInterval(game, 1000);
setInterval(writeStatistics, 250 * 60);
setInterval(changeSeason, 5000);