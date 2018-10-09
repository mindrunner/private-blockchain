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

    console.log(await Blockchain.getBlock(blockchain.getBlockHeight()));

    for (let i = 0; i <= 100; i++) {
        let block = new Block("test data " + i);
        await blockchain.mineBlock(block);
        console.log(await Blockchain.getBlock(blockchain.getBlockHeight()))
    }

    console.log("Validating Chain....");
    await blockchain.validateChain();

    console.log(blockchain.getBlockHeight())

}();





