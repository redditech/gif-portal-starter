// ref Nader Dabit for help here
// https://twitter.com/dabit3

const fs = require('fs');
const anchor = require("@project-serum/anchor");

const account = anchor.web3.Keypair.generate();

fs.writeFileSync('./keypair.json', JSON.stringify(account));