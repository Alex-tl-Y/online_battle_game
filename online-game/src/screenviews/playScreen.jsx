function PlayScreen() {
    (
        <>
          <div id = "game-information">
            <p id = "round-numer"></p>
            <p id = "timer-display"></p>
          </div>

          <div id = "scoreboard">
            <ul id = "scores"></ul>
          </div>

          <div id = "minimap"></div>

          <div id = "randomLocation"></div>

          <div id = "chat">
            <ul id = "chat-history"></ul>
          </div>
        </>
    )
}

export default PlayScreen;