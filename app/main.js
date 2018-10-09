#!/usr/bin/node
'use strict';

const Block = require('./src/block.js').Block;
const Blockchain = require('./src/blockchain.js').Blockchain;

/**
 * This is an example on how to use the Blockchain.
 */
void async function() {
    let blockchain = new Blockchain();

    // Always call init() after constructing object
    await blockchain.init();

    console.log(await Blockchain.getBlock(await blockchain.getBlockHeight()));

    for (var i = 0; i <= 1000; i++) {
        let block = new Block("test data " + i);
        await blockchain.mineBlock(block);
        console.log(await Blockchain.getBlock(await blockchain.getBlockHeight()))
    }

    await blockchain.validateChain();

    console.log(await blockchain.getBlockHeight())

}();





