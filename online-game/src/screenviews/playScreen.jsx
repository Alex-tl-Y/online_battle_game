import minimap from "../assets/sr-minimap.png"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PlayScreen() {
  const [circle, setCircle] = useState(null)
  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  function handleMinimapClick(e) {
    let rect = e.currentTarget.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;


    console.log("Relative Coords", {x, y});

    setCircle({x, y});
    
    
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

          <div id = "randomLocation"></div>

          <div id = "chat">
            <ul id = "chat-history"></ul>
          </div>

          <button onClick={goBack}>Back</button>
        </>
    );
}

export default PlayScreen;