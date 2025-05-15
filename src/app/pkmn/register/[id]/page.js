"use client";

import Pkmn from "public/data/pkmn.json";
import attacks from "public/data/attacks.json";
import NavigationButtons from "@/components/NavigationButtons";
import PokemonDetails from "@/components/PokemonDetails";
import Notification from "@/components/Notification";
import RangeList from "@/components/RangeList";
import AttackSelector from "@/components/AttackSelector";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { id } = useParams();
  const selectedPkmn = Pkmn.find((pokemon) => pokemon.id === parseInt(id));

  let lastId = parseInt(id) - 1 == 0 ? 721 : parseInt(id) - 1;
  let nextId = parseInt(id) + 1 == 722 ? 1 : parseInt(id) + 1;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredAttacks, setfilteredAttacks] = useState(selectedPkmn.types);
  const [selectedAttacks, setSelectedAttacks] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState([
    { name: "STRENGTH", value: 1, color: "bg-blue-500"},
    { name: "DEXTERITY", value: 1, color: "bg-blue-500" },
    { name: "VITALITY", value: 1, color: "bg-blue-500" },
    { name: "SPECIAL", value: 1, color: "bg-blue-500" },
    { name: "INSIGHT", value: 1, color: "bg-blue-500" },
    
    { name: "TOUGH", value: 1, color: "bg-green-500" },
    { name: "COOL", value: 1, color: "bg-green-500" },
    { name: "BEAUTY", value: 1, color: "bg-green-500" },
    { name: "CUTE", value: 1, color: "bg-green-500" },
    { name: "CLEVER", value: 1, color: "bg-green-500" },

    { name: "BRAWL", value: 0, color: "bg-red-500" },
    { name: "CHANNEL", value: 0, color: "bg-red-500" },
    { name: "CLASH", value: 0, color: "bg-red-500" },
    { name: "EVASION", value: 0, color: "bg-red-500" },

    { name: "ALERT", value: 0, color: "bg-red-500" },
    { name: "ATHLETIC", value: 0, color: "bg-red-500" },
    { name: "NATURE", value: 0, color: "bg-red-500" },
    { name: "STEALTH", value: 0, color: "bg-red-500" },

    { name: "ALLURE", value: 0, color: "bg-red-500" },
    { name: "ETIQUETTE", value: 0, color: "bg-red-500" },
    { name: "INTIMIDATE", value: 0, color: "bg-red-500" },
    { name: "PERFORM", value: 0, color: "bg-red-500" },
    
    { name: "HAPPINESS", value: 0, color: "bg-fuchsia-700" },
    { name: "LOYALTY", value: 0, color: "bg-fuchsia-700" },
  ]);
  const [nickname, setNickname] = useState(selectedPkmn.name.charAt(0).toUpperCase() + selectedPkmn.name.slice(1));
  const [ability, setAbility] = useState(selectedPkmn.ability);
  const [message, setMessage] = useState("");
  const [HP, setHP] = useState(selectedPkmn.total_hp);
  const [battlesWon, setBattlesWon] = useState(0);


  function handleTypeClick(attack) {
    setSelectedAttacks((prevSelectedAttacks) => [...prevSelectedAttacks, attack]);
    setDropdownOpen(false);
  }

  function handleRangeChange(index, value) {
    setSelectedRanges((prevRanges) => {
      const newRanges = [...prevRanges];
      newRanges[index] = { ...newRanges[index], value: value };
      return newRanges;
    });
}

  async function handleSave() {
    const selectedAttackIds = selectedAttacks.map((attack) => attack.id);
    const data = { 
      id_dex: parseInt(id),
      attacks: selectedAttackIds,
      trainer_id: localStorage?.getItem("authKey") || '1',
      nickname,
      ranges: selectedRanges,
      ability,
      total_hp: HP,
      battles_won: battlesWon,
      obs: ""
    };

    try {
      const response = await fetch(`/api/pkmn/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      setMessage('Pokémon Salvo com sucesso!');

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  const rangesVal = [1, 2, 3, 4, 5];

  return (
    <main className="flex items-center justify-center">
      <div className="w-100 mt-3">
        <NavigationButtons onSave={handleSave} />
        <PokemonDetails
          selectedPkmn={selectedPkmn}
          nickname={nickname}
          setNickname={setNickname}
          ability={ability}
          setAbility={setAbility}
          HP={HP}
          setHP={setHP}
          battlesWon={battlesWon}
          setBattlesWon={setBattlesWon}
          lastId={lastId}
          nextId={nextId}
        />
        <RangeList
          selectedRanges={selectedRanges}
          rangesVal={rangesVal}
          handleRangeChange={handleRangeChange}
        />
        <AttackSelector
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          filteredAttacks={filteredAttacks}
          setfilteredAttacks={setfilteredAttacks}
          selectedAttacks={selectedAttacks}
          setSelectedAttacks={setSelectedAttacks}
          attacks={attacks}
          handleTypeClick={handleTypeClick}
        />
        <Notification
          message={message}
          setMessage={setMessage}
        />
      </div>
    </main>
  );
}