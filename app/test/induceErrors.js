#!/usr/bin/node
'use strict';

const Blockchain = require('../src/blockchain.js').Blockchain;

void async function () {
    let blockchain = new Blockchain();
    await blockchain.init();

    let inducedErrorBlocks = [2, 4, 7];
    for (var i = 0; i < inducedErrorBlocks.length; i++) {
        await blockchain.createError(inducedErrorBlocks[i]);
    }

    await blockchain.validateChain();
}();
