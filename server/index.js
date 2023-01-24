///////////////////////////////////////////////

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Server running on port 3001");
})
///////////////////////////////////////////////


// GLOBAL
let rooms = [];


// FUNCTIONS

// Find the position of a room in the array of the rooms
function findRoom(room_id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].room_id == room_id) {
            return i;
        }
    }
    return -1;
}

// Check if a move is a winning move
function checkWinner(i) {
    let combs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let comb of combs) {
        if (
            rooms[i].table[comb[0]] === rooms[i].table[comb[1]] &&
            rooms[i].table[comb[1]] === rooms[i].table[comb[2]] &&
            rooms[i].table[comb[0]] != '.'
        ) {
            return true;
        }
    }

    return false;

}

// Check if there is a tie between the players
function checkTie(j) {
    for (let i = 0; i < rooms[j].table.length; i++) {
        if (rooms[j].table[i] === ".") {
            return false;
        }
    }
    return true;
}


///////////////////////////////////////////////

// GET request to get all the rooms
app.get("/getRooms", async (req, res) => {
    res.send(rooms);
});

// POST request to get a room
app.post("/getRoom", async (req, res) => {
    let i = await findRoom(req.body.room_id);
    if (i != -1) {
        res.send(rooms[i]);
    } else {
        res.send("NONE");
    }
})

// POST request to create a room
app.post("/createRoom", async (req, res) => {
    try {
        let name = req.body.name;
        let room = {
            player1: name,
            player2: null,
            now: null, // which player's turn is now
            started: false,
            winner: null,
            room_id: Date.now(),
            table: [".", ".", ".",
                ".", ".", ".",
                ".", ".", "."] // the tic tac toe table

        }
        rooms.push(room);
        console.log(rooms);
        res.send(room);
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST request to join a room
app.post("/joinRoom", async (req, res) => {
    try {
        let name = req.body.name;
        let i = await findRoom(req.body.room_id);
        if (rooms[i].player2 === null) {
            if (name != rooms[i].player1) {
                rooms[i].player2 = name;
                res.send(rooms[i]);
            } else {
                res.send("NAME_ERROR");
            }
        } else {
            res.send("FULL");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST request to leave a room
app.post("/leaveRoom", async (req, res) => {
    try {
        let name = req.body.name;
        let i = await findRoom(req.body.room_id);
        if (name === rooms[i].player2) {
            rooms[i].table = [".", ".", ".",
                ".", ".", ".",
                ".", ".", "."];
            rooms[i].winner = null;
            rooms[i].now = null;
            rooms[i].player2 = null;
        } else if (name === rooms[i].player1) {
            rooms.splice(i, 1);
        }
        res.send("SUCCESS");
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST request to make a move
app.post("/makeMove", async (req, res) => {
    try {
        let x = req.body.x;
        let i = await findRoom(req.body.room_id);
        if (rooms[i].now === rooms[i].player1) {
            if (rooms[i].table[x] === ".") {
                rooms[i].table[x] = "X";
                if (checkWinner(i)) {
                    rooms[i].now = null;
                    rooms[i].winner = rooms[i].player1
                    res.send(rooms[i])
                }
                else if (checkTie(i)) {
                    rooms[i].now = null;
                    rooms[i].winner = "No One"
                    res.send(rooms[i])
                } else {
                    rooms[i].now = rooms[i].player2;
                    res.send(rooms[i]);
                }
            } else {
                res.send("OCCUPIED");
            }
        } else if (rooms[i].now === rooms[i].player2) {
            if (rooms[i].table[x] === ".") {
                rooms[i].table[x] = "O";
                if (checkWinner(i)) {
                    rooms[i].now = null;
                    rooms[i].winner = rooms[i].player2
                    res.send(rooms[i])
                }
                else if (checkTie(i)) {
                    rooms[i].now = null;
                    rooms[i].winner = "No One"
                    res.send(rooms[i])
                } else {
                    rooms[i].now = rooms[i].player1;
                    res.send(rooms[i]);
                }
            } else {
                res.send("OCCUPIED");
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})


// POST request to START a game
app.post("/startGame", async (req, res) => {
    try {
        let i = await findRoom(req.body.room_id);
        if (rooms[i].player2 != null) {
            rooms[i].table = [".", ".", ".",
                ".", ".", ".",
                ".", ".", "."];
            rooms[i].winner = null;
            rooms[i].started = true;
            rooms[i].now = rooms[i].player1;
            res.status(200).send(rooms[i]);
        } else {
            res.send("NOPLAYER2");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("ERROR");
    }
})



///////////////////////////////////////////////