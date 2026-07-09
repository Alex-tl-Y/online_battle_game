import { io } from "socket.io-client";

console.log("Creating socket");

export const socket = io("http://localhost:3001");