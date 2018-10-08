#!/usr/bin/node
'use strict';

const Blockchain = require('../src/blockchain.js').Blockchain;

void async function() {
    let blockchain = new Blockchain();
    await blockchain.init();
    await blockchain.rewriteChain();
    await blockchain.validateChain();
}();

