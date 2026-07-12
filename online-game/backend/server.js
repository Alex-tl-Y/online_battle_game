import express from 'express';
import { Server } from 'socket.io';
import http from "http";

class User {
    score = 0;
    position = 0;
    score_from_round = 0;

    constructor(name, id, isHost = false) {
        this.name = name;
        this.id = id;
    }

    getName () {
        return this.name;
    }

    getID() {
        return this.id;
    }

    getScore() {
        return this.score;
    }

    getIsHost() {
        return this.isHost;
    }

    getPosition() {
        return this.position;
    }

    getScoreFromRound() {
        return this.score_from_round;
    }
}
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let allUsers = [];

io.on("connection", (socket) => {
    console.log("Player connected", socket.id);

    socket.on("scoreboard", () => {
        io.emit("set-scoreboard", allUsers);
        console.log("Hi");
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected")
    });

    socket.on("create-game", (username) => {
        console.log("Game created");
        let user = new User(username, socket.id, true);
        allUsers.push(user);
    });
})

server.listen(3001, () => {
    console.log("Server is running");
})
