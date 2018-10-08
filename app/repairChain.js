#!/usr/bin/node
'use strict';

const Block = require('./src/block.js').Block;
const Blockchain = require('./src/blockchain.js').Blockchain;

void async function() {
    let blockchain = new Blockchain();
    await blockchain.init();
    await blockchain.rewriteChain();
    await blockchain.validateChain();
}();




// let inducedErrorBlocks = [2,4,7];
// for (var i = 0; i < inducedErrorBlocks.length; i++) {
//     blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
// }
//
// blockchain.validateChain();
