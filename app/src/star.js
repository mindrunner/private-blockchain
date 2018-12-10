'use strict';

/**
 * The Block Data Structure to be used with Blockchain
 *
 * @type {Star}
 */
exports.Star = class Star {
    /**
     * Creates a new Block
     * @param data The Block's content.
     * @constructor
     */
    constructor() {
        this.dec = '';
        this.ra = '';
        this.mag = '';
        this.cen = '';
        this.story = ''
    }
};
