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

//用RSA和key来对data参数签名校验
var testRSASign2 = (data) => {
	var hash = CryptoJS.SHA256(data).toString();
	console.log('hash: ', hash);
	var signature = key.encrypt(hash, 'base64');
	console.log('signature: ', signature);
	
}

testRSASign("aaaaaaaaaa");
testRSASign2("aaaaaaaaaa");