import minimap from "../assets/sr-minimap.png"
import {locationList} from "../location_info/locationList"
import Scoreboard from "../components/scoreboard"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../socket";

function PlayScreen() {
  const [circle, setCircle] = useState(null)
  const [location, setLocation] = useState(null)
  const [score, setScore] = useState(0)
  const [unusedLocations, setUnusedLocations] = useState(locationList)
  const [round, setRound] = useState(null)
  const [timer, setTimer] = useState(null)
  const [playerList, setPlayerList] = useState([])
  const [minimapPos, setMinimapPos] = useState({x: 0, y: 0, zoom: 1})
  const navigate = useNavigate();


  useEffect(() => {
    socket.emit("scoreboard");
    
    socket.on("set-scoreboard", (allUsers) => {
      setPlayerList(allUsers);
      console.log("Hi");
        
    })
    
    
  }, [])

  useEffect(() => {
    socket.on("display-location", (currentLocation) => {
      setLocation(currentLocation);
      console.log("new location")
    })
  }, [])

  useEffect(() => {
    socket.on("round-number", (roundNumber) => {
      setRound(roundNumber);
    })
  }, [])

  useEffect(() => {
    socket.on("timer-information", (sec) => {
      setTimer(sec);
    })
  }, [])

  useEffect(() => {
    socket.on("next-round", () => {
      socket.emit("random-location");
    })
  })
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
    socket.emit("random-location");
      
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
                </div>
              </div>

              <div id = "randomLocation">
                {location && <img  id = "randomLocationImg" src = {location.imgsrc}/>}
              </div>
              
              <div id = "score">
                {score && <p>Score: {score}</p>}
              </div>

              <div id = "chat">
                <ul id = "chat-history"></ul>
              </div>

              
            </div>
          </div>
          <div id = "playButton">
            <button id = "backButton" onClick={goBack}>Back</button>
            <p id = "test">{minimapPos.zoom}</p>
            <button id = "randomLocationButton" onClick = {randomLocation}>Random Location</button>
            <button id = "guess" onClick = {calculateDistance}>Guess</button>
          </div>
        </>
    );
}

export default PlayScreen;