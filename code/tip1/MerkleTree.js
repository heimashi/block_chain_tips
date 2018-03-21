'use strict';

//使用CryptoJS中的sha256库
var CryptoJS = require("crypto-js");

/*
* 定义树节点，包含三个参数：
* previousHash：前一个区块的Hash值
* data：区块中记录的数据
*/
class TreeNode {
    constructor(data, leftChildHash, rightChildHash) {
        this.data = data;
        this.leftChildHash = leftChildHash.toString();
        this.rightChildHash = rightChildHash.toString();
    }
}

var datas = ['a','b','c','d'];
var merkleTree = [];

var buildMerkleTree = (datas) => {

	for(data in datas){
		var dataHash = CryptoJS.SHA256(data).toString();
		var node = new TreeNode(dataHash, 0, 0);
		merkleTree.push(node);
	}


}