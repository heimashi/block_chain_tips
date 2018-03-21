'use strict';

var NodeRSA = require('node-rsa');

//产生512位的RSA key
var key = new NodeRSA({b: 512});

//打印出公钥
var publicDer = key.exportKey('public');
console.log("public key:", publicDer);

//打印出私钥
var privateDer = key.exportKey('private');
console.log("private key:", privateDer);
 

//用RSA加密解密data参数
var testRSA = (data) => {
	var encrypted = key.encrypt(data, 'base64');
	console.log('encrypted: ', encrypted);
	var decrypted = key.decrypt(encrypted, 'utf8');
	console.log('decrypted: ', decrypted);
}


//Node的一个命令行交互库
const vorpal = require('vorpal')();

//添加功能：用RSA加密解密data参数
vorpal
  .command('TestRSA <data>', '用RSA加密解密data参数')
  .action(function(args, callback) {
    testRSA(args.data);
    callback();
  });

vorpal
  .delimiter('RSA_Cli$')
  .show();