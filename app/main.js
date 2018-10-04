#!/usr/bin/node
'use strict';

const simpleChain = require('./src/simpleChain.js');

let blockchain = new simpleChain.Blockchain();

for (var i = 0; i <= 10; i++) {
    blockchain.addBlock(new simpleChain.Block("test data " + i));
}

blockchain.validateChain();

let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
    blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}

blockchain.validateChain();
