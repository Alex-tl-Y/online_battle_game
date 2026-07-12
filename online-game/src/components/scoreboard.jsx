function Scoreboard({ players }) {
    return (
        <>
          <p>Scoreboard</p>
          {players.map(player => (
            <div className = "scoreboard">{player.name}, {player.score}</div>
          ))}
        </>
    )
}

export default Scoreboard;