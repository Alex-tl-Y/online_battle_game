import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { socket } from "../socket"

function HomeScreen() {
    const [username, setUsername] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const navigate = useNavigate();

    function joinGame(e) {
      e.preventDefault();
      console.log("joining");
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
              <input id = "username" placeholder = "Enter username" className = "userInput" onChange = {(e) => setUsername(e.target.value)} value = {username}/>
              <input id = "joinGame" placeholder = "Enter game code" className = "userInput"/>

              <button id = "joinGameButton" onClick={joinGame}>Join Game</button>
              <button id = "createGame" onClick={createGame}>Create Game</button>
            </form>
          </div>
        </div>
      </>
    );
}

export default HomeScreen;