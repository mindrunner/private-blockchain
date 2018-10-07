class Block {
    constructor(data) {
        this.hash = "";
        this.height = 0;
        this.body = data;
        this.time = 0;
        this.previousBlockHash = "";
    }
}

class GenesisBlock extends Block {
    constructor(data) {
        super(data);
        this.hash = "";
        this.height = 0;
        this.time = 0;
        this.previousBlockHash = "";
    }
}

module.exports = [
    Block : Block,
    GenesisBlock : GenesisBlock
]
