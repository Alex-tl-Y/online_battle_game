import minimap from "../assets/sr-minimap.png"
import {locationList} from "../location_info/locationList"
import Scoreboard from "../components/scoreboard"
import TransitionPage from "../components/transition";
import GameOver from "../components/gameover";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../socket";

function PlayScreen() {
  const [circle, setCircle] = useState(null)
  const [actualCoords, setActualCoords] = useState(null)
  const [location, setLocation] = useState(null)
  const [score, setScore] = useState(0)
  const [unusedLocations, setUnusedLocations] = useState(locationList)
  const [round, setRound] = useState(null)
  const [timer, setTimer] = useState(null)
  const [roomCode, setRoomCode] = useState(null);
  const [playerList, setPlayerList] = useState([])
  const [roundInformation, setRoundInformation] = useState([])
  const [gameOverInfo, setGameOverInfo] = useState([])
  const [minimapPos, setMinimapPos] = useState({x: 0, y: 0, zoom: 1})
  const [isHost, setisHost] = useState(false);
  const [canGuess, setCanGuess] = useState(false);
  const navigate = useNavigate();


  // Listens for updates to the scoreboard.
  useEffect(() => {
    socket.emit("scoreboard");
    socket.emit("roomcode");
    socket.emit("host");
    
    
    socket.on("set-scoreboard", (allUsers) => {
      setPlayerList(allUsers);
      console.log("Hi");
        
    })
    
  }, [])

  // Sets the room code and displays it in the lobby
  useEffect(() => {
    socket.on("set-roomcode", (roomcode) => {
      setRoomCode(roomcode);

    })
  }, [])

  // Sends players back to the home screen on a reload or if they try to bypass with /play
  useEffect(() => {
    socket.on("back-to-home", () => {
      navigate("/");
    }) 
  })
  
  // User is a host which means they get to start matches and has some visuals to indicate that they are the host.
  useEffect(() => {
    socket.on("isHost", () => {
      setisHost(true);
    })
  })

  // Listens for updates on the location the user has to guess.
  useEffect(() => {
    socket.on("display-location", (currentLocation) => {
      setRoundInformation([]);
      setActualCoords(null);
      setLocation(currentLocation);
      console.log("new location")
    })
  }, [])

  // Listens for updates to the round number.
  useEffect(() => {
    socket.on("round-number", (roundNumber) => {
      setRound(roundNumber);
    })
  }, [])

  // Listens to updates to the timer counting down.
  useEffect(() => {
    socket.on("timer-information", (sec) => {
      setTimer(sec);
    })
  }, [])

  // Listens to updates of when the next round should start
  useEffect(() => {
    socket.on("next-round", () => {
      socket.emit("game-rounds");
    })
  }, [])

  // Listens to updates of when to transition in between rounds.
  useEffect(() => {
    socket.on("round-transition", (scoreFromRoundList, locationCoords) => {
      setRoundInformation(scoreFromRoundList);
      setActualCoords(locationCoords);
    })
  }, [])

  useEffect(() => {
    socket.on("can-guess", () => {
      setCanGuess(true);
    })

    socket.on("cannot-guess", () => {
      setCanGuess(false);
    })
  })

    useEffect(() => {
    socket.on("game-over", (gameOverScoreList) => {
      setGameOverInfo(gameOverScoreList);
      setRoundInformation([]);
    })
  }, [])

  function goBack() {
    navigate("/");
  }

  // Handles the clicks on the minimap
  function handleMinimapClick(e) {
    let rect = e.target.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let imageX = (x - minimapPos.x) / minimapPos.zoom;
    let imageY = (y - minimapPos.y) / minimapPos.zoom;

    console.log("Relative Coords", {imageX, imageY});

    

    setCircle({x: imageX, y: imageY});
  }
    
   // Calculates the distance between the users input and the actual location
   function calculateDistance() {
    
    socket.emit("calculate-distance", circle);
    
    // let actualX = 0;
    // let actualY = 0;

    // if (location) {
    //   actualX = location.x;
    //   actualY = location.y;
    // }

    // let euclideanDistance = (actualX - circle.x) ** 2 + (actualY - circle.y) ** 2;

    // console.log(`The euclidean distance is ${euclideanDistance}`)

    // setScore(Math.round(5000 * Math.pow(0.998, (euclideanDistance/200))));

  }

  // Picks random image
  function randomLocation() {
    socket.emit("start-game");
      
  }

  // Zoom in feature on the minimap
  function zoomFeature(e) {

      let rect = e.currentTarget.getBoundingClientRect();

      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const imageX = (cursorX - minimapPos.x) / minimapPos.zoom;
      const imageY = (cursorY - minimapPos.y) / minimapPos.zoom;

      const deltaZoom = e.deltaY * -0.001;
      const newZoom = minimapPos.zoom + deltaZoom;
      const ratio = 1 - newZoom / minimapPos.zoom;
      
      if (newZoom >= 1 && newZoom <= 5) {
        setMinimapPos(prev => {
          const imageX = (cursorX - prev.x)/prev.zoom;
          const imageY = (cursorY - prev.y)/prev.zoom;

          return {
            x: cursorX - imageX * newZoom,
            y: cursorY - imageY * newZoom,
            zoom: newZoom,
          };
        });
      }
      
    
  }
    return (
        <>
          <div id = "playscreen">
            <div id = "game-information">
              <p id = "round-number">Round {round}</p>
              <p id = "room-code">Room Code: {roomCode}</p>
              <p id = "timer-display">{timer}</p>
            </div>

            <div id = "bottom-half">
              <div id = "scoreboard">
                {playerList && <Scoreboard players = {playerList}/>}
              </div>

              <div id = "minimap">
                <div id = "minimapview" onWheel={zoomFeature}
                style = {{
                  transformOrigin: "0 0",
                  transform: `translate(${minimapPos.x}px, ${minimapPos.y}px) scale(${minimapPos.zoom})`,
                  }}>
                  <img id = "minimapimg" src = {minimap} onClick={handleMinimapClick} />
                
                  <svg style={{
                  position: "absolute",
                  inset: "0",
                  pointerEvents: "none",
                }}
                width="100%"
                height="100%">{circle && (<circle cx = {circle.x} cy = {circle.y} r = '5' fill = 'red'/>)}</svg> 

                <svg style={{
                  position: "absolute",
                  inset: "0",
                  pointerEvents: "none",
                }}
                width="100%"
                height="100%">{actualCoords && (<circle cx = {actualCoords.x} cy = {actualCoords.y} r = '5' fill = 'blue'/>)}</svg>       
                </div>
              </div>

              <div id = "randomLocation">
                {location && <img  id = "randomLocationImg" src = {location.imgsrc}/>}
              </div>
              
              <div id = "score">
                {score && <p>Score: {score}</p>}
              </div>
              
              <div id = "transition-overlay">
                {(roundInformation.length > 0) && <TransitionPage scoreFromRoundList = {roundInformation}/>}
              </div>
              
              <div id = "gameover-overlay">
                {(gameOverInfo.length > 0) && <GameOver finalStats = {gameOverInfo}/>}
              </div>
              
            </div>
          </div>
          <div id = "playButton">
            <button id = "backButton" onClick={goBack}>Back</button>
            <p id = "test">{minimapPos.zoom}</p>
            <button disabled = {!isHost} className = "start-button" onClick = {randomLocation}>Start Game!</button>
            <button disabled = {!canGuess} className="guess-button" onClick = {calculateDistance}>Guess</button>
          </div>
        </>
    );
}

export default PlayScreen;