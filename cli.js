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
        'history [keywords...]',
        'View search history by keywords',
        (yargs) => {
            yargs.positional('keywords', {
                describe: 'History type to view. Use: keywords',
                type: 'string',
            });
        },
        (yargs) => {
            if (yargs.keywords === undefined) {
                handleHistory();
            } else if (yargs.keywords === 'keywords') {
                //TODO function that takes keywords
            } else {
                console.log("Invalid arguyment.")
            }
        }
    )
    .help()
    .alias('h', 'help').argv;
