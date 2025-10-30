export async function fetcher(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Fetch error: ${res.status} ${error}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetcher error:", err);
    throw err;
  }
}