const socket = io();
const side = 10;
var matrix = [];
var season;
var isCanvasCreated = false;

function setup() {
    const weatherText = document.getElementById('weather');
    socket.on("matrix", drawCreatures);
    function drawCreatures(data) {
        matrix = data.matrix;
        season = data.seasonTheme;
        creatures = data.creatures;

        if (!isCanvasCreated) {
            createCanvas(matrix.length * side + 1, matrix.length * side + 1);
            isCanvasCreated = true;
        }
        weatherText.innerText = "Season: " + data.seasonName;
        background('#8f8f8f');
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix.length; x++) {
                if (matrix[y][x] == 0) fill("#8f8f8f");
                else if (matrix[y][x] == 1) fill(season.grassColor);
                else if (matrix[y][x] == 2) fill(season.grassEaterColor);
                else if (matrix[y][x] == 3) fill(season.predatorColor);
                else if (matrix[y][x] == 4) fill(season.destroyerColor);
                else if (matrix[y][x] == 5) fill(season.grenadeColor);
                else if (matrix[y][x] == 6) fill(season.fireColor);
                rect(x * side, y * side, side, side);
            }
        }
    }
}

function restart() {
    socket.emit("restart");  
}

function addGrass() {
    socket.emit("addGrass");
}

function addGrassEater() {
    socket.emit("addGrassEater");
}

function addPredator() {
    socket.emit("addPredator");
}

function changeSeason() {
    socket.emit("changeSeason");
}