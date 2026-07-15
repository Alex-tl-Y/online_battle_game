function TransitionPage({ scoreFromRoundList }) {
    return (
        <div id = "transition_overlay">
          <h2 id = "transition_heading">Round Over! Here are the scores for this round:</h2>
          {scoreFromRoundList.map(player => (
            <div className="score_from_round">{player.name}: {player.score_from_round}</div>
          ))}
        </div>
    )
}

export default TransitionPage;