'use strict';

const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js').Block;
const GenesisBlock = require('./block.js').GenesisBlock;
const db = require('./levelSandbox.js');

exports.Blockchain = class Blockchain {
    constructor() {
    }

    async init() {
        await this.addBlock(new Block("First block in the chain - Genesis block"));
    }

    async addBlock(newBlock) {
        if("GenesisBlock" === typeof(newBlock)) {
            newBlock.height = 0;
        } else {
            let blockHeight = await this.getBlockHeight();
            if(blockHeight < 0) {
                throw "Genesis Block not found, did you call init()?"
            }
            newBlock.height = blockHeight + 1;
        }

        newBlock.time = new Date().getTime().toString().slice(0, -3);
        if (blockHeight > 0) {
            newBlock.previousBlockHash = (await db.getLevelDBData(blockHeight)).hash;
        }
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
    }

    async getBlockHeight() {
        return await db.getLastKey();
    }

    async getBlock(blockHeight) {
        let block = await db.getLevelDBData(blockHeight);
        return JSON.parse(JSON.stringify(block));
    }

    async validateBlock(blockHeight) {
        let block = await this.getBlock(blockHeight);
        let blockHash = block.hash;
        block.hash = '';
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
