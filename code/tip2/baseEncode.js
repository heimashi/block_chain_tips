'use strict';

var Base58 = require('base58');

//Node的一个命令行交互库
const vorpal = require('vorpal')();

vorpal
  .command('encode <data>', '对data进行base58编码')
  .action(function(args, callback) {
    var encoded = Base58.encode(args.data);
	console.log(encoded);
    callback();
  });

vorpal
  .command('decode <data>', '对data进行base58解码')
  .action(function(args, callback) {
    var decoded = Base58.decode(args.data);
	console.log(decoded);
    callback();
  });

vorpal
  .delimiter('Base58_Cli$')
  .show();