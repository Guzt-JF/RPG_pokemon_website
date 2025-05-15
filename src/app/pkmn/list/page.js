'use client'
import { useEffect, useState } from "react";
import Pkmn from "public/data/pkmn.json"; 
import attacks from "public/data/attacks.json"; 
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Home() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`/api/pkmn/get_basic?id=${localStorage.getItem("authKey") || '999'}`)
        const response = await fetch(`/api/pkmn/get_basic?id=${localStorage.getItem("authKey") || '999'}`); // Call the API route
        if (!response.ok) {
          console.log(response)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    }

    fetchData();
  }, []);

  return (
    <main className="flex items-center justify-center">
      <div className="w-100">
        <button
          className="text-white capitalize bg-red-900 hover:bg-red-800 w-full cursor-pointer"
          onClick={() => (window.location.href = `/`)}
        >
          retornar
        </button>
  
        {!data ? (
          <p>Loading...</p>
        ) : (
          <div>
            {data.map((item) => (
              <div  onClick={() => (window.location.href = `/pkmn/list/${item._id}`)} key={item._id} className="p-4 border border-gray-300 rounded shadow">
                <img
                  src={item.pkmnDetails.sprites.front_default}
                  alt={item.pkmnDetails.name}
                  className="w-32 h-32 object-contain mx-auto"
                />
                <p className="text-center">
                  <strong>{item.pkmnDetails.name}</strong>
                </p>
                <p className="text-center">{item.nickname}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}