'use strict';

//使用CryptoJS中的sha256库
var CryptoJS = require("crypto-js");

/*
* 定义树节点，包含三个参数：
* data：区块中记录的Hash值
* leftChildHash：左子节点的Hash值
* rightChildHash：右子节点的Hash值
*/
class TreeNode {
    constructor(data, leftChildHash, rightChildHash) {
        this.data = data;
        this.leftChildHash = leftChildHash.toString();
        this.rightChildHash = rightChildHash.toString();
    }
}


/*
* 根据传人对数组，为数组生成一棵Merkle Tree
*/
var buildMerkleTree = (dataArr) => {
	var merkleTree = [];
	var index = 0;
	var tmpList = [];
	for(var data in dataArr){
		var dataHash = CryptoJS.SHA256(data).toString();
		var node = new TreeNode(dataHash, "", "");
		tmpList.push(node);
	}
	merkleTree.push(tmpList);

	while(merkleTree[index].length>1){
		index++;
		var size = 0;
		var tmpNodeList = [];
		var maxSize = merkleTree[index-1].length;
		while(size<maxSize){
			var leftNode = merkleTree[index-1][size++];
			if(size<maxSize){
				var rightNode = merkleTree[index-1][size++];
				var dataHash = CryptoJS.SHA256(leftNode.data+rightNode.data).toString();
				var newNode = new TreeNode(dataHash, leftNode.data, rightNode.data);
				tmpNodeList.push(newNode);
			}else{
				var newNode = new TreeNode(leftNode.data, leftNode.data, "");
				tmpNodeList.push(newNode);
			}

		}

		merkleTree.push(tmpNodeList);
		
	}
	
	console.log(merkleTree);
}


//Node的一个命令行交互库
const vorpal = require('vorpal')();


//添加功能：为数组生成一棵Merkle Tree
vorpal
  .command('buildTree <datas...>', 'build datas to merkleTree')
  .action(function(args, callback) {
    var merkleTree = buildMerkleTree(args.datas);
    this.log("buildMerkleTree:");
    this.log(merkleTree);
    callback();
  });

vorpal
  .delimiter('MerkleCli$')
  .show();