function GameOver({finalStats}) {
  const first = finalStats[0];
  const second = finalStats[1];
  const third = finalStats[2];
  const rest = finalStats.slice(3);
  return (
    <div id = "gameover-overlay">
      <div id = "podium">
        {second && (
          <div id = "secondPlace">
          <h1>2nd Place</h1>
          {second.name}
        </div>)}

        {first && (
          <div id = "firstPlace">
          <h1>1st Place</h1>
          {first.name}
          </div>)}

        {third && (
          <div id = "thirdPlace">
          <h1>3rd Place</h1>
          {third.name}
        </div>)}
      </div>

      {rest.length > 0 && (
        <div id = "others">
        <h1>The Rest</h1>
        {rest.map(player => (
          <div>{player.name}</div>
        ))}
      </div>)}
    </div>
  )
}

export default GameOver;