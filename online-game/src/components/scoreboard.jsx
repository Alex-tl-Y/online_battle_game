function Scoreboard({ players }) {
    return (
        <>
          {players.map(player => (
            <div>{player}</div>
          ))}
          <p>Hi</p>
        </>
    )
}

export default Scoreboard;