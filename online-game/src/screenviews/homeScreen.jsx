import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../socket"

function HomeScreen() {
    const [champion, setChampion] = useState('')
    const [username, setUsername] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [invalidCode, setInvalidCode] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
      socket.on("invalid-roomcode", () => {
        setInvalidCode("Invalid Code");
      })
    },[])

    useEffect(() => {
      socket.on("valid-roomcode", () => {
        navigate("/play");
      })
    },[])

    function joinGame(e) {
      e.preventDefault();
      console.log("joining");
      
      if (username != "" && roomCode != "") {
        socket.emit("join-game", username, roomCode);
      }

    }

    function createGame(e) {
      e.preventDefault();
      if (username != "") {
        navigate("/play");
        socket.emit("create-game", username);
        
        
      }
      
    }
    return (
      <>
        <div id = "homepage">
          <div id = "homescreen">
            <form id = "userHomeInput">
              <input id = "champion" placeholder="Enter champion for your icon" className = "userInput" onChange = {(e) => setUsername(e.target.value)} value = {username}/>
              <input id = "username" placeholder = "Enter username" className = "userInput" onChange = {(e) => setUsername(e.target.value)} value = {username}/>
              <input id = "joinGame" placeholder = "Enter game code" className = "userInput" onChange = {(e) => setRoomCode(e.target.value)} value = {roomCode}/>

              <button id = "joinGameButton" onClick={joinGame}>Join Game</button>
              <button id = "createGame" onClick={createGame}>Create Game</button>
            </form>
            <p>{invalidCode}</p>
          </div>
        </div>
      </>
    );
}

export default HomeScreen;