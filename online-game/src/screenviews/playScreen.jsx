import minimap from "../assets/sr-minimap.png"
import {locationList} from "../location_info/locationList"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PlayScreen() {
  const [circle, setCircle] = useState(null)
  const [location, setLocation] = useState(null)
  const [score, setScore] = useState(0)
  const [unusedLocations, setUnusedLocations] = useState(locationList)
  const [round, setRound] = useState(5)
  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  // Handles the clicks on the minimap
  function handleMinimapClick(e) {
    let rect = e.target.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;


    console.log("Relative Coords", {x, y});

    calculateDistance({x,y})

    setCircle({x, y});
    
   // Calculates the distance between the users input and the actual location
   function calculateDistance(userSpot) {

    let actualX = 0;
    let actualY = 0;

    if (location) {
      actualX = location.x;
      actualY = location.y;
    }

    let euclideanDistance = (actualX - userSpot.x) ** 2 + (actualY - userSpot.y) ** 2;

    console.log(`The euclidean distance is ${euclideanDistance}`)

    setScore(Math.round(5000 * Math.pow(0.998, (euclideanDistance/200))));

   } 
  }

  // Picks random image
  function randomLocation() {
    const randomNumber = Math.floor(Math.random() * unusedLocations.length);

    setLocation(unusedLocations[randomNumber]);

    //const remaining = 

  
  }
    return (
        <>
          <div id = "game-information">
            <p id = "round-number">Round {round}</p>
            <p id = "timer-display"></p>
          </div>

          <div id = "bottom-half">
            <div id = "scoreboard">
              <ul id = "scores"></ul>
            </div>

            <div id = "minimap">
              <img src = {minimap} onClick={handleMinimapClick}/>
              
              <svg style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
            width="100%"
            height="100%">{circle && (<circle cx = {circle.x} cy = {circle.y} r = '5' fill = 'red'/>)}</svg>
            </div>

            <div id = "randomLocation">
              {location && <img  id = "randomLocationImg" src = {location.imgsrc}/>}
              {score && <p>Score: {score}</p>}
            </div>

            <div id = "chat">
              <ul id = "chat-history"></ul>
            </div>

            
          </div>
          <button onClick={goBack}>Back</button>
          <p id = "test"></p>
          <button onClick = {randomLocation}>Random Location</button>
        </>
    );
}

export default PlayScreen;