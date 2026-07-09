import { useNavigate } from "react-router-dom";


function HomeScreen() {
    const navigate = useNavigate();

    function joinGame() {
      console.log("joining");
    }

    function createGame() {
      navigate("/play");
   
      
    }
    return (
      <>
        <div id = "homescreen">
          <form id = "userHomeInput">
            <input id = "username" placeholder = "Enter username" class = "userInput"/>
            <input id = "joinGame" placeholder = "Enter game code" class = "userInput"/>

            <button id = "joinGameButton" onClick={joinGame}>Join Game</button>
            <button id = "createGame" onClick={createGame}>Create Game</button>
          </form>
        </div>
      </>
    );
}

export default HomeScreen;