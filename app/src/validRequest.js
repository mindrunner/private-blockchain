'use strict';

/**
 * The Block Data Structure to be used with Blockchain
 *
 * @type {ValidRequest}
 */
exports.ValidRequest = class ValidRequest {
    /**
     * Creates a new Block
     * @param data The Block's content.
     * @constructor
     */
    constructor() {
        this.registerStar = true;
        this.status = undefined;
    }
};
