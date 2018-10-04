#!/usr/bin/node
'use strict';

const simpleChain = require('./src/simpleChain.js');

let blockchain = new simpleChain.Blockchain();

for (var i = 0; i <= 10; i++) {
    blockchain.addBlock(new simpleChain.Block("test data " + i));
}

blockchain.validateChain();
