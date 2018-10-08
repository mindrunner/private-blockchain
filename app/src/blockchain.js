'use strict';

const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js').Block;
const GenesisBlock = require('./block.js').GenesisBlock;
const db = require('./levelSandbox.js');

exports.Blockchain = class Blockchain {
    constructor() {
        this.initialized = false;
    }

    async init() {
        this.initialized = true;
        if (await this.getBlockHeight() < 0) {
            await this.mineBlock(this.createBlock("First block in the chain - Genesis block"));
        }
    }

    createBlock(data) {
        return new Block(data);
    }

    async mineBlock(newBlock) {
        if (!this.initialized) {
            throw "Blockchain uninitialized, please call init() first."
        }
        let blockHeight = await this.getBlockHeight();
        newBlock.height = blockHeight + 1;

        newBlock.time = new Date().getTime().toString().slice(0, -3);
        if (newBlock.height > 0) {
            newBlock.previousBlockHash = (await this.getBlock(blockHeight)).hash;
        }
        if (!newBlock.hash) {
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
        } else {
            throw "Cannot mine already hashed Block."
        }
    }

    async getBlockHeight() {
        return await db.getLastKey();
    }

    async getBlock(blockHeight) {
        let block = await db.getLevelDBData(blockHeight);
        return JSON.parse(block);
    }

    async rewriteChain() {
        let errorLog = [];
        for (let i = 0; i < await this.getBlockHeight() - 1; i++) {
            if (!await this.validateBlock(i))  {
                let block = await this.getBlock(i);
                block.hash = undefined;
                block.hash = SHA256(JSON.stringify(block)).toString();
                db.addLevelDBData(block.height, JSON.stringify(block).toString());
            }
        }
    }

    async validateBlock(blockHeight) {
        let block = await this.getBlock(blockHeight);
        let blockHash = block.hash;
        block.hash = undefined;
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    async validateChain() {
        let errorLog = [];
        for (let i = 0; i < await this.getBlockHeight() - 1; i++) {
            if (!await this.validateBlock(i)) errorLog.push(i);
            let blockHash = (await this.getBlock(i)).hash;
            let previousHash = (await this.getBlock(i + 1)).previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
        } else {
            console.log('No errors detected');
        }
    }
};
