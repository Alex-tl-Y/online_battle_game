function Scoreboard({ players }) {
    return (
        <>
          <p>Scoreboard</p>
          {players.map(player => (
            <div className = {player.coords_from_round ? "guessed-scoreboard" : "scoreboard"}>
              <img className = "user-icon" src= {`https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${player.champion}.png`}/>
              <p className = "scoreboard-info">{player.name}, {player.score}</p>
              </div>
          ))}
        </>
    )
}

export default Scoreboard;