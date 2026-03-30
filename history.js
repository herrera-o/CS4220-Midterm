import fs from "fs";
import { select } from "@inquirer/prompts";
import { runSearch } from "./app.js";

function getHistory() {
  if (!fs.existsSync("search_history.json")) {
    return [];
  }

  const data = fs.readFileSync("search_history.json", "utf8").trim();

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function handleHistory() {
  const history = getHistory();

  if (history.length === 0) {
    console.log("No search history found.");
    return;
  }

  const answer = await select({
    message: "Select a previous search:",
    choices: [
      { name: "Exit", value: "Exit" },
      ...history.map((keyword) => ({
        name: keyword,
        value: keyword,
      })),
    ],
  });

  if (answer === "Exit") {
    console.log("Goodbye!");
    return;
  }

  await runSearch(answer);
}