import Pkmn from "public/data/pkmn.json";
import attacks from "public/data/attacks.json";

export async function GET(req) {
  const API_URL = process.env.API_URL;
  const URL_KEY = process.env.URL_KEY;

  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const idFilter = searchParams.get("id");
    console.log(idFilter);

    const response = await fetch(`${API_URL}/api/PKMN/get_basic`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${URL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({trainer_id: idFilter}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Enrich the fetched data
    const enrichedResults = result.map((item) => {
      const matchingPkmn = Pkmn.find((pkmn) => pkmn.id === item.id_dex);
      return {
        ...item,
        pkmnDetails: matchingPkmn || null,
      };
    });

    const enrichedWithAttacks = enrichedResults.map((item) => {
      if (!item.attacks) {
      const resolvedAttacks = item.attacks?.map((attackId) => {
        const matchingAttack = attacks.find((attack) => attack.id === attackId);
        return matchingAttack || null; // Replace with the attack object or null if not found
      });
      return {
        ...item,
        attacks: resolvedAttacks,
      };
    }
      return item; // Return the item as is if no attacks are present
    });

    return new Response(JSON.stringify(enrichedWithAttacks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}