function Scoreboard({ players }) {
    return (
        <>
          {players.map(player => (
            <div>{player}</div>
          ))}
          <p>Scoreboard</p>
        </>
    )
}

export default Scoreboard;