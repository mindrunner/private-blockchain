'use strict';

/**
 * The Block Data Structure to be used with Blockchain
 *
 * @type {RequestObject}
 */
exports.RequestObject = class RequestObject {
    /**
     * Creates a new Block
     * @param data The Block's content.
     * @constructor
     */
    constructor() {
        this.walletAddress = undefined;
        this.requestTimeStamp = 0;
        this.message = "";
        this.validationWindow = 0;
    }
};
