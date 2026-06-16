function HomeScreen() {
    function joinGame() {

    }

    function createGame() {

    }
    return (
      <>
        <div id = "homescreen">
          <form id = "userHomeInput">
            <input id = "username" placeholder = "Enter username"></input>
            <input id = "joinGame" placeholder = "Enter game code"></input>
            <button id = "joinGameButton" onClick={joinGame}></button>
            <button id = "createGame" onClick={createGame}></button>
          </form>
        </div>
      </>
    )
}

export default HomeScreen;