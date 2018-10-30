'use strict';

/**
 * The Block Data Structure to be used with Blockchain
 *
 * @type {Block}
 */
exports.Block = class Block {
    /**
     * Creates a new Block
     * @param data The Block's content.
     * @constructor
     */
    constructor(data) {
        this.hash = undefined;
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.nonce = 0;
        this.previousBlockHash = "";
    }
};
