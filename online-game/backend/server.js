import express from 'express';
import { Server } from 'socket.io';
import http from "http";
import {locationList} from "../src/location_info/locationList"

class User {
    score = 0;
    position = 0;
    score_from_round = 0;
    coords_from_round = {x: 0, y: 0};
    

    constructor(name, id, isHost) {
        this.name = name;
        this.id = id;
        this.isHost = isHost;
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

class Room {
  allUsers = []
  userGuessed = []
  unusedLocations = [...locationList];
  currentLocation = null;
  round = 1;

  constructor(code) {
    this.code = code;
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

let allRooms = new Map();
// let allUsers = [];
// let userGuessed = [];
// let unusedLocations = [...locationList];
// let currentLocation = unusedLocations[0];
// let round = 1;

io.on("connection", (socket) => {
    console.log("Player connected", socket.id);
    
    // Handles updating the scoreboard
    socket.on("scoreboard", () => {
      const roomInfo = findUserRoom(socket.id, allRooms);
      if (!roomInfo) {
        io.to(socket.id).emit("back-to-home");
      }
      else {
        console.log(allRooms);
        console.log(roomInfo);
        io.to(roomInfo[0]).emit("set-scoreboard", roomInfo[1].allUsers);
      }
        
    });

    // Handles sending the room code
    socket.on("roomcode", () => {
      const roomInfo = findUserRoom(socket.id, allRooms);
      if (!roomInfo) {
        io.to(socket.id).emit("back-to-home");
      }
      else {
        io.to(roomInfo[0]).emit("set-roomcode", roomInfo[0]);
      }
    })

    socket.on("host", () => {
      const info = findUserRoom(socket.id, allRooms);
      if (info[2].isHost) {
        io.to(socket.id).emit("isHost");
      }
    })

    // Handles disconnect cases
    socket.on("disconnect", () => {
        console.log("Player disconnected")
        const roomInfo = findUserRoom(socket.id, allRooms);

        if (roomInfo) {
          roomInfo[1].allUsers.forEach((user) => {
            if (socket.id == user.id) {
              if (!user.isHost) {
                roomInfo[1].allUsers = roomInfo[1].allUsers.filter(element => element !== user);
                roomInfo[1].userGuessed = roomInfo[1].userGuessed.filter(element => element !== user);
                io.to(roomInfo[0]).emit("set-scoreboard", roomInfo[1].allUsers);
              }
              else {
                allRooms.delete(roomInfo[0]);
              }
            }
            
          })
        }
    });

    // Creates a game (lobby)
    socket.on("create-game", (username) => {
        console.log("Game created");
        let roomCode;
        // Ensures unique room code
        while(1) {
          roomCode = generateRoomCode();
          if (!allRooms.has(roomCode)) {
            break;
          }
        }
        
        const room = new Room(roomCode);
        let user = new User(username, socket.id, true);
        room.allUsers.push(user)
        allRooms.set(roomCode, room);
        socket.join(roomCode);
        
      
    });

    // Join a game (lobby)
    socket.on("join-game", (username, roomcode) => {
      if (allRooms.has(roomcode)) {
        let room = allRooms.get(roomcode);
        let user = new User(username, socket.id, false);
        room.allUsers.push(user);
        socket.join(roomcode);
        io.to(socket.id).emit("valid-roomcode");

      }

      else {
        io.to(socket.id).emit("invalid-roomcode");
      }

    })

    // Main logic of the game rounds here.
    socket.on("start-game", () => {
      const roomInfo = findUserRoom(socket.id, allRooms);
      startGame(roomInfo[1]);      
    });

    // Handles distance calculation and the respective score.
    socket.on("calculate-distance", (circle) => {
      const roomInfo = findUserRoom(socket.id, allRooms);

      roomInfo[1].allUsers.forEach((user) => {
        if (socket.id == user.id) {
          if (roomInfo[1].userGuessed.includes(user)) {
            socket.emit("already-guessed");
          
          }
          else {
            roomInfo[1].userGuessed.push(user);

            const euclideanDistance = (roomInfo[1].currentLocation.x - circle.x) ** 2 + (roomInfo[1].currentLocation.y - circle.y) ** 2;

            roomInfo[1].allUsers.forEach((user) => {

              if (socket.id == user.id) {
                let calculated_score = Math.round(5000 * Math.pow(0.998, (euclideanDistance/200)));
                user.score += calculated_score;
                user.score_from_round = calculated_score;
                io.to(roomInfo[0]).emit("set-scoreboard", roomInfo[1].allUsers);
                io.to(socket.id).emit("cannot-guess");
              }
            })
          }
        }
      })

    })
})

function startGame(room) {
  room.round = 1;
  roundStart(room);
  io.to(room.code).emit("can-guess");
}

function roundTransition(room) {
  let sec = 7;

  let roundInformation = [...room.allUsers];
  sortScoreFromRound(roundInformation);
  io.to(room.code).emit("round-transition", roundInformation, {x: room.currentLocation.x, y: room.currentLocation.y});
  io.to(room.code).emit("cannot-guess");

  let timer = setInterval(() => {
    sec--;
    if (sec < 0) {
      clearInterval(timer);
      sec = 4;
      if (room.round > 3) {
        let gameOverInformation = [...room.allUsers];
        sortScore(gameOverInformation);
        io.to(room.code).emit("game-over", gameOverInformation);
      }
      else {
        roundStart(room);
        
      }
    }
  }, 1000)
}

function roundStart(room) {
  const randomNumber = Math.floor(Math.random() * room.unusedLocations.length);
  let sec = 30;
  io.to(room.code).emit("can-guess");

  room.currentLocation = room.unusedLocations[randomNumber];

  io.to(room.code).emit("display-location", room.currentLocation);
  io.to(room.code).emit("round-number", room.round);

  let timer = setInterval(() => {
    io.to(room.code).emit("timer-information", sec);
    sec--;
    if (sec < 0 || room.userGuessed.length == room.allUsers.length) {
      room.userGuessed = [];
      clearInterval(timer);
      room.round ++;
      sec = 30;
      roundTransition(room);
    }
  }, 1000)
}

function findUserRoom(socketid, roomMap) {
  for (let [key, value] of roomMap ) {
    for (const user of value.allUsers) {
      if (user.id == socketid){
        // In this case the key is the room code, the value is the room object and the user is the user object.
        return [key, value, user];
      }
    }
  }
  return null;
}

function sortScore(userList) {
  userList.sort((a,b) => a.score - b.score);
}

function sortScoreFromRound(userList) {
  userList.sort((a,b) => a.score_from_round - b.score_from_round);
  
}

function generateRoomCode() {
  let roomCodeID = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  for (let i = 0; i < 4; i ++) {
    roomCodeID += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return roomCodeID;
}

server.listen(3001, () => {
    console.log("Server is running");
})
