function Scoreboard({ players }) {
    return (
        <>
          {players.map(player => (
            <div className = {player.coords_from_round ? "guessed-scoreboard" : "ungussed-scoreboard"}>
              <p className="scoreboard-info"># {player.position}</p>
              <div id = "name-points-info">
                <div className = "scoreboard-info">{player.name}</div>
                <div className = "scoreboard-info">{player.score}</div>
              </div>
              <img className = "user-icon" src= {`https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${player.champion}.png`}/>
            </div>
          ))}
        </>
    )
}

export default Scoreboard;