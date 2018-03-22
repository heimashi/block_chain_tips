'use strict';

var NodeRSA = require('node-rsa');

//使用CryptoJS中的sha256库
var CryptoJS = require("crypto-js");

//产生512位的RSA key
var key = new NodeRSA({b: 512});

//打印出公钥
var publicDer = key.exportKey('public');
console.log("public key:", publicDer);

//打印出私钥
var privateDer = key.exportKey('private');
console.log("private key:", privateDer);
 

//用RSA和key来对data参数签名校验
var testRSASign = (data) => {
	var signature = key.sign(data, 'base64', 'utf8');
	console.log('signature: ', signature);
	var verifyFlag = key.verify(data, signature, 'utf8', 'base64');
	console.log('verify: ', verifyFlag);
}

//用RSA和key来对data参数签名
var getSignature = (data) => {
	//先通过摘要算法把要签名的data经过摘要得到其Hash值
	var dataHash = CryptoJS.SHA256(data).toString();
	
	//把data的摘要用私钥进行加密，然后将签名和data内容一起发给收信人
	var signature = key.encrypt(dataHash, 'base64');

	return {content:data, sign: signature};
}

//验证签名
var verifySignature = (msg) => {
	//收信人拿到签名后，用公钥解密签名拿到信的摘要
	var decryptedDataHash = key.decrypt(msg.sign, 'utf8');
	//计算data的摘要值
	var dataHash = CryptoJS.SHA256(msg.content).toString();
	return dataHash === decryptedDataHash;
}

//testRSASign("aaaaaaaaaa");



//Node的一个命令行交互库
const vorpal = require('vorpal')();

//添加功能：对data进行数字签名并验证
vorpal
  .command('TestSign <data>', '对data进行数字签名并验证')
  .action(function(args, callback) {
    var signAndData = getSignature(args.data);
	console.log(signAndData);
	console.log("verify:", verifySignature(signAndData));
    callback();
  });

vorpal
  .delimiter('RSA_Cli$')
  .show();
