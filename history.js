//Import file system module to read search_history.json
const fs = require("fs");

//Imports inquirer to create interactive CLI menus
const inquirer = require("inquirer")

//Retrives search history from the JSON file
function getHistory(){
    
    //Checks to see if the history file exists to evoid any errors
    if (!fs.existsSync("serch_history.json")){
        return [];
    }

    //Read file contents
    const data = fs.readFilesSync("search_history.json");

    //Convert JSON string into JavaScript array
    return JSON.parse(data);
}

//Handles the history command
async function handleHistory(){
    const history = getHistory();

    //Checks if there is no history
    if (history.length === 0){
        console.log("No search history found.");
        return;
    }

    //Creates a list of choices with "Exit" as the first option available
    const choices = ["Exit", ... history];

    //Displays an interactive list prompt to the user
    const answer = await inquirer.createPromptModule([
        {
            type: "list",
            name: "keyword",
            message: "Select a previous search:",
            choices: choices
        }
    ]);

    //Terminates the program if the user selects "Exit"
    if (answer.keyword === "Exit"){
        console.log("Goodbye!");
        return;
    }

    //Imports app.js to reuse search functionality
    const app = require("./app");

    //Calls search function with selected keyword
    await app.search(answer.keyword);
}

module.exports = {
    handleHistory
};