const BASE_URL = "https://dummyjson.com";

export async function getTodos() {
  const response = await fetch(`${BASE_URL}/todos?limit=12`);

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const data = await response.json();

  return data.todos;
}