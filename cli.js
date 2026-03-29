import { handleHistory } from "./history.js";
import { runSearch } from './app.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    // Display the usage message when the user runs the command without any arguments
    .usage('Usage: $0 <command>')
    // Define the "search" command with a required "keyword" argument
    .command(
        'search <keyword>',
        'Search by keyword',
        (yargs) => {
            yargs.positional('keyword', {
                describe: 'Search by keyword',
                type: 'string',
            });
        },
        (yargs) => {
            //TODO call app.js search function
            runSearch(yargs.keyword);
        }
    )
    // Define the "history" command with a required "keywords" argument
    .command(
        'history <keywords...>', // Use "keywords..." to allow multiple keywords
        'Search past by keywords',
        (yargs) => {
            yargs.positional('keywords', {
                describe: 'Search by keywords',
                type: 'string',
            });
        },
        (yargs) => {
            // TODO call function in app.js to search history
            console.log(`Searching history ${yargs.keywords}`);
        }
    )
    .help()
    .alias('h', 'help').argv;
