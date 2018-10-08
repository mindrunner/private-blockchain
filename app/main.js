#!/usr/bin/node
'use strict';

const Block = require('./src/block.js').Block;
const Blockchain = require('./src/blockchain.js').Blockchain;

void async function() {
    let blockchain = new Blockchain();

    await blockchain.init();
    console.log(await blockchain.getBlock(await blockchain.getBlockHeight()));

    for (var i = 0; i <= 100; i++) {
        let block = blockchain.createBlock("test data " + i);
        await blockchain.mineBlock(block);

        console.log(await blockchain.getBlock(await blockchain.getBlockHeight()))
    }

    await blockchain.validateChain();

    console.log(await blockchain.getBlockHeight())


}();





