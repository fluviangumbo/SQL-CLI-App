//import
import { pool, connectToDb } from './connection.js';
import Cli from './classes/cli.js';

await connectToDb();

//start cli
const client = new Cli(pool, false);

client.startCli();