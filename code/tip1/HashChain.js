'use strict';

var CryptoJS = require("crypto-js");

class Block {
    constructor(index, previousHash, data) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.data = data;
    }
}

var getGenesisBlock = () => {
    return new Block(0, "0", "I'm the genesis block");
};

var blockchain = [getGenesisBlock()];

var getLatestBlock = () => blockchain[blockchain.length - 1];

var calculateHashForBlock = (block) => {
    return CryptoJS.SHA256(block.index + block.previousHash + block.data).toString();
};

var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (calculateHashForBlock(previousBlock) !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } 
    return true;
};

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    return new Block(nextIndex, calculateHashForBlock(previousBlock), blockData);
};

var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};


const vorpal = require('vorpal')();

vorpal
  .command('bc', 'show blockchain')
  .action(function(args, callback) {
    this.log(blockchain);
    callback();
  });

vorpal
  .command('add <data>', 'add block to chain')
  .action(function(args, callback) {
    var newBlock = generateNextBlock(args.data);
    this.log("Add new block:");
    this.log(newBlock);
    addBlock(newBlock);
    callback();
  });

vorpal
  .delimiter('HashChainCli$')
  .show();