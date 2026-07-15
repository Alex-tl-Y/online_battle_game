function Scoreboard({ players }) {
    return (
        <>
          <p>Scoreboard</p>
          {players.map(player => (
            <div className = {player.coords_from_round ? "guessed-scoreboard" : "scoreboard"}>{player.name}, {player.score}</div>
          ))}
        </>
    )
}

export default Scoreboard;