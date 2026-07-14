function TransitionPage({ scoreFromRoundList }) {
    return (
        <>
          {scoreFromRoundList.map(player => (
            <div>{player.name},{player.score_from_round}</div>
          ))}
        </>
    )
}

export default TransitionPage;