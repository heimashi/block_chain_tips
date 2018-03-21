'use strict';

//使用CryptoJS中的sha256库
var CryptoJS = require("crypto-js");


/*
* 定义区块的数据结构，暂包含两个参数：
* previousHash：前一个区块的Hash值
* data：区块中记录的数据
*/
class Block {
    constructor(previousHash, data) {
        this.previousHash = previousHash.toString();
        this.data = data;
    }
}

/*
* 创建第一区块，即创世块：
* previousHash：没有前一个区块，故写为0
* data：区块中记录的数据
*/
var getGenesisBlock = () => {
    return new Block("0", "I'm the genesis block");
};

//blockchain即区块链，初始化时会实例化创世块
var blockchain = [getGenesisBlock()];

//获得区块链中的最后一个区块
var getLatestBlock = () => blockchain[blockchain.length - 1];

//用Sha256计算区块的Hash
var calculateHashForBlock = (block) => {
    return CryptoJS.SHA256(block.previousHash + block.data).toString();
};

//判断新的区块是否合法
var isValidNewBlock = (newBlock, previousBlock) => {
    if (calculateHashForBlock(previousBlock) !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } 
    return true;
};

//根据传人的data内容产生新的区块
var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    return new Block(calculateHashForBlock(previousBlock), blockData);
};

//将生成的新区块加入区块链中
var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

//Node的一个命令行交互库
const vorpal = require('vorpal')();

//添加功能：查看区块链的具体信息
vorpal
  .command('bc', 'show blockchain')
  .action(function(args, callback) {
    this.log(blockchain);
    callback();
  });

//添加功能：根据data添加新区块
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