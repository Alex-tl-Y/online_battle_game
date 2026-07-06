import { useNavigate } from "react-router-dom";
import { socket } from "../socket.js"

function HomeScreen() {
    const navigate = useNavigate();

    function joinGame() {
      console.log("joining");
    }

    function createGame() {
      navigate("/play");
      socket.emit("create-game");
    }
    return (
      <>
        <div id = "homescreen">
          <form id = "userHomeInput">
            <input id = "username" placeholder = "Enter username"/>
            <input id = "joinGame" placeholder = "Enter game code"/>

            <button id = "joinGameButton" onClick={joinGame}>Join Game</button>
            <button id = "createGame" onClick={createGame}>Create Game</button>
          </form>
        </div>
      </>
    );
}

export default HomeScreen;