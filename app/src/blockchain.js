'use strict';

const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js').Block;
const db = require('./levelSandbox.js');

/**
 * Private methods
 * @private
 */
const _getDifficulty = Symbol("getDifficulty");
const _hashBlock = Symbol("hashBlock");


/**
 * Class which represents the Blockchain, handles the persistence and offers method for handling Block data structures.
 *
 */
exports.Blockchain = class Blockchain {
    /**
     * @constructor
     *
     */
    constructor() {
        this.initialized = false;
        /**
         * This can be either a Hash-Prefix (e.g. "000") or "auto".
         * See _getDifficulty()
         */
        this.difficulty = "0";
    }

    /**
     * Initializes the Blockchain, creates Genesis @Block if nessesary. Needs to be called immediately after
     * constructing the object.
     *
     * @return {Promise<void>}
     */
    async init() {
        this.initialized = true;
        this.blockHeight = await db.getLastKey();
        if (this.getBlockHeight() < 0) {
            await this.addBlock(new Block("First block in the chain - Genesis block"));
        }
    }

    /**
     * Calculates the current mining difficulty. Either a fixed hash-prefix, or a "000.."-prefix determined by
     * getBlockHeight()
     *
     * @returns {Promise<string>} The current mining difficulty
     */
    async [_getDifficulty]() {
        if (this.difficulty === "auto") {
            let len = (this.getBlockHeight()).toString().length;
            let diff = "0";
            while (len-- > 0) {
                diff += "0";
            }
            return diff;
        } else {
            return this.difficulty;
        }
    }

    /**
     * Returns the hash of a given Block
     *
     * @param block The Block of which hash to be returned
     * @returns The Block's hash
     * @private
     */
    static [_hashBlock](block) {
        let hash = block.hash;
        block.hash = undefined;
        let blockHash = SHA256(JSON.stringify(block)).toString();
        block.hash = hash;
        return blockHash;
    }

    /**
     * Eveluates the Blockheight of the Blockchain
     *
     * @returns The Blockchain's Blockheight
     */
    getBlockHeight() {
        return this.blockHeight;
    }

    /**
     * Gets a Block based on the Block Height
     *
     * @param blockHeight Blockheight of Block to be returned
     * @returns {Promise<Block>} if Block found, undefined otherwise
     */
    static async getBlock(blockHeight) {
        let block = await db.getLevelDBData(blockHeight);
        return (block ? JSON.parse(block) : undefined);
    }

    /**
     * Gets a Block based on the Hash
     *
     * @param hash the hash
     * @returns {Promise<Block>} if Block found, undefined otherwise
     */
    static async getBlockByHash(hash) {
        let block = await db.getBlockByHash(hash);
        return (block ? block : undefined);
    }

    /**
     * Gets a list of Blocks based on the Wallet Address
     *
     * @param address the wallet address
     * @returns {Promise<Block>} if Block found, undefined otherwise
     */
    static async getBlocksByWalletAddress(address) {
        let block = await db.getBlocksByWalletAddress(address);
        return (block ? block : undefined);
    }

    /**
     * Mines a new Block and add it to the persistence layer
     *
     * @param newBlock The Block to me mined
     * @return {Promise<void>}
     */
    async addBlock(newBlock) {
        if (!this.initialized) {
            throw "Blockchain uninitialized, please call init() first."
        }
        let blockHeight = this.getBlockHeight();
        newBlock.height = blockHeight + 1;
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        if (newBlock.height > 0) {
            newBlock.previousBlockHash = (await Blockchain.getBlock(blockHeight)).hash;
        }
        if (!newBlock.hash) {
            do {
                newBlock.nonce++;
                newBlock.hash = Blockchain[_hashBlock](newBlock);
            } while (!newBlock.hash.startsWith(await this[_getDifficulty]()));
            await db.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
            this.blockHeight = newBlock.height;
        } else {
            throw "Cannot mine already hashed Block."
        }
    }

    /**
     * Validates a single Block
     *
     * @param blockHeight the block height to check
     *
     * @return {Promise<boolean>} true if block is valid, false otherwise
     */
    async validateBlock(blockHeight) {
        let block = await Blockchain.getBlock(blockHeight);
        let blockHash = block.hash;
        block.hash = undefined;
        let validBlockHash = Blockchain[_hashBlock](block);
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    /**
     * Validates the whole Blockchain
     *
     * @returns {Promise<boolean>} true if chain is valid, false otherwise
     */
    async validateChain() {
        let errorLog = [];
        for (let i = 0; i <= this.getBlockHeight(); i++) {
            if (!await this.validateBlock(i))
                errorLog.push(i);
            if (i > 0) {
                let blockHash = (await Blockchain.getBlock(i - 1)).hash;
                let previousHash = (await Blockchain.getBlock(i)).previousBlockHash;
                if (blockHash !== previousHash) {
                    errorLog.push(i);
                }
            }
        }
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
            return false;
        } else {
            console.log('No errors detected');
            return true;
        }
    }
};
