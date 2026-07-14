import express from 'express';
import { Server } from 'socket.io';
import http from "http";
import {locationList} from "../src/location_info/locationList"

class User {
    score = 0;
    position = 0;
    score_from_round = 0;
    coords_from_round = {x: 0, y: 0}

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
let userGuessed = [];
let unusedLocations = [...locationList];
let currentLocation = unusedLocations[0];
let round = 1;

io.on("connection", (socket) => {
    console.log("Player connected", socket.id);

    // Handles updating the scoreboard
    socket.on("scoreboard", () => {
        io.emit("set-scoreboard", allUsers);
        
    });

    // Handles disconnect cases
    socket.on("disconnect", () => {
        console.log("Player disconnected")

        allUsers.forEach((user) => {
          if (socket.id == user.id) {
              allUsers = allUsers.filter(element => element !== user);
          }
          io.emit("set-scoreboard", allUsers);
      })
    });

    // Creates a game (lobby)
    socket.on("create-game", (username) => {
        console.log("Game created");
        let user = new User(username, socket.id, true);
        allUsers.push(user);
    });

    // Main logic of the game rounds here.
    socket.on("start-game", () => {
      startGame();      
    });

    // Handles distance calculation and the respective score.
    socket.on("calculate-distance", (circle) => {
      const euclideanDistance = (currentLocation.x - circle.x) ** 2 + (currentLocation.y - circle.y) ** 2;

      allUsers.forEach((user) => {
        if (socket.id == user.id) {
          user.score += Math.round(5000 * Math.pow(0.998, (euclideanDistance/200)));
          io.emit("set-scoreboard", allUsers);
        }
      })

    })
})

function startGame() {
  round = 1;
  roundStart();
}

function roundTransition() {
  let sec = 7;

  let roundInformation = [...allUsers];
  sortScoreFromRound(roundInformation);
  io.emit("round-transition", roundInformation);

  let timer = setInterval(() => {
    sec--;
    if (sec < 0) {
      clearInterval(timer);
      sec = 7;
      if (round > 3) {
        let gameOverInformation = [...allUsers];
        sortScore(gameOverInformation);
        io.emit("game-over", gameOverInformation);
      }
      else {
        roundStart();
        
      }
    }
  }, 1000)
}

function roundStart() {
  const randomNumber = Math.floor(Math.random() * unusedLocations.length);
  let sec = 5;

  currentLocation = unusedLocations[randomNumber];

  io.emit("display-location", currentLocation);
  io.emit("round-number", round);

  let timer = setInterval(() => {
    io.emit("timer-information", sec);
    sec--;
    if (sec < 0 || userGuessed.length == allUsers.length) {
      clearInterval(timer);
      round ++;
      sec = 5;
      roundTransition();
    }
  }, 1000)
}

function sortScore(userList) {
  userList.sort((a,b) => a.score - b.score);
}

function sortScoreFromRound(userList) {
  userList.sort((a,b) => a.score_from_round - b.score_from_round);
  
}

server.listen(3001, () => {
    console.log("Server is running");
})
