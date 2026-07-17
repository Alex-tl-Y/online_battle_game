import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChampionDropdown from "../components/championDropdown";
import { socket } from "../socket"

function HomeScreen() {
    const [championInput, setChampionInput] = useState('')
    const [championSelected, setChampionSelected] = useState('')
    const [username, setUsername] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const [invalidCode, setInvalidCode] = useState('')
    const [champFocused, setChampFocused] = useState(false)
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
      
      if (username != "" && roomCode != "" && championSelected != "") {
        socket.emit("join-game", username, roomCode, championSelected);
      }

    }

    function createGame(e) {
      e.preventDefault();
      if (username != "" && championSelected != "") {
        navigate("/play");
        socket.emit("create-game", username, championSelected);
        
        
      }
    
    }

    function selectChamp(champ) {
      setChampionSelected(champ);
      setChampFocused(false);
    }

    function champInputFocused() {
      setChampFocused(true);
    }

    function champInputBlur() {
      setChampFocused(false);
    }

    return (
      <>
        <div id = "homepage">
          <div id = "homescreen">
            <form id = "userHomeInput">
              <input id = "championInput" placeholder="Enter champion for your icon" className = "userInput" onFocus={champInputFocused} onBlur={champInputBlur} onChange = {(e) => setChampionInput(e.target.value)} value = {championInput}/>
              <div id = "champion-icon">
                {champFocused && <ChampionDropdown championInput = {championInput} championSelected={selectChamp}/>}
                <div id = "champion-icon-container">
                  {championSelected.length > 0 && <img src= {`https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${championSelected}.png`}/>}
                </div>
                
              </div>
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