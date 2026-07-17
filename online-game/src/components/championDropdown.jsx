import { useState, useEffect } from "react";

function ChampionDropdown ({ championInput, championSelected }) {
  const [championList, setChampionList] = useState([]);

  useEffect(() => {
    getAllChampions();
    
  }, [])

  async function getAllChampions () {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/16.14.1/data/en_US/champion.json");
    const data = await response.json();
    
    const champs = Object.keys(data.data)
    setChampionList(champs);
    console.log(champs);
  }

  return (
    <div id = "dropdown-container">
      {championInput.length > 0 && championList.filter(champ => champ.toLowerCase().startsWith(championInput.toLowerCase())).slice(0,5).map(champ => (
        <div className="champ-dropdown" onMouseDown={() => championSelected(champ)}>
          <img className="dropdownIcon" src= {`https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion/${champ}.png`}/>
          <p className = "dropdownName">{champ}</p>
          </div>
      ))}
      
    </div>
  )
}

export default ChampionDropdown;