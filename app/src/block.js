exports.Block = class Block {
    constructor(data) {
        this.hash = undefined;
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.nonce = 0;
        this.previousBlockHash = undefined;
    }
};
