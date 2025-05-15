export async function POST(req) {
  const requestData = await req.json();

  const API_URL = process.env.API_URL;
  const URL_KEY = process.env.URL_KEY;

  try {
    const response = await fetch(`${API_URL}/api/trainer/get`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${URL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
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