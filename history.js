import fs from "fs";
import inquirer from "inquirer";
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

  const choices = ["Exit", ...history];

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "keyword",
      message: "Select a previous search:",
      choices: choices,
    },
  ]);

  if (answer.keyword === "Exit") {
    console.log("Goodbye!");
    return;
  }

  await runSearch(answer.keyword);
}
