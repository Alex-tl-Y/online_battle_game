import minimap from "../assets/sr-minimap.png"
import {locationList} from "../location_info/locationList"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PlayScreen() {
  const [circle, setCircle] = useState(null)
  const [location, setLocation] = useState(null)
  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  function handleMinimapClick(e) {
    let rect = e.currentTarget.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;


    console.log("Relative Coords", {x, y});

    calculateDistance({x,y})

    setCircle({x, y});
    
   function calculateDistance(userSpot) {

    let actualX = 0;
    let actualY = 0;

    if (location) {
      actualX = location.x;
      actualY = location.y;
    }

    let euclideanDistance = (actualX - userSpot.x) ** 2 + (actualY - userSpot.y) ** 2;

    console.log(`The euclidean distance is ${euclideanDistance}`)

   } 
  }

  function randomLocation() {
    const randomNumber = Math.floor(Math.random() * locationList.length);

    setLocation(locationList[randomNumber]);

  
  }
    return (
        <>
          <div id = "game-information">
            <p id = "round-numer"></p>
            <p id = "timer-display"></p>
          </div>

          <div id = "scoreboard">
            <ul id = "scores"></ul>
          </div>

          <div id = "minimap">
            <img src = {minimap} onClick={handleMinimapClick}/>
            
            <svg style={{
            position: "absolute",
            top: 18,
            left: 10,
            pointerEvents: "none",
          }}
          width="100%"
          height="100%">{circle && (<circle cx = {circle.x} cy = {circle.y} r = '5' fill = 'red'/>)}</svg>
          </div>

          <div id = "randomLocation">
            {location && <img src = {location.imgsrc}/>}
          </div>

          <div id = "chat">
            <ul id = "chat-history"></ul>
          </div>

          <button onClick={goBack}>Back</button>
          <button onClick = {randomLocation}>Random Location</button>
        </>
    );
}

export default PlayScreen;