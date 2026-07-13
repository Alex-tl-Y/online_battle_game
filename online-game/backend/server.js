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
let roundInMotion = false;

io.on("connection", (socket) => {
    console.log("Player connected", socket.id);

    socket.on("scoreboard", () => {
        io.emit("set-scoreboard", allUsers);
        
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected")

        allUsers.forEach((user) => {
          if (socket.id == user.id) {
              allUsers = allUsers.filter(element => element !== user);
          }
          io.emit("set-scoreboard", allUsers);
      })
    });

    socket.on("create-game", (username) => {
        console.log("Game created");
        let user = new User(username, socket.id, true);
        allUsers.push(user);
    });

    socket.on("random-location", () => {
      
      if (round > 3) {
        io.emit("end-game");
        round = 1;
      }
      else if (!roundInMotion) {
        roundInMotion = true;
        const randomNumber = Math.floor(Math.random() * unusedLocations.length);
        let sec = 30;

        currentLocation = unusedLocations[randomNumber];

        io.emit("display-location", currentLocation);
        io.emit("round-number", round);

        let timer = setInterval(() => {
          io.emit("timer-information", sec);
          sec--;
          if (sec < 0 || userGuessed.length == allUsers.length) {
            clearInterval(timer);
            round ++;
            sec = 30;
            io.emit("next-round");
            roundInMotion = false;
          }
        }, 1000)
      }

      
    });

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

server.listen(3001, () => {
    console.log("Server is running");
})
