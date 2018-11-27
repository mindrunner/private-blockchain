const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js').Block;
const Blockchain = require('./blockchain.js').Blockchain;

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app
     */
    constructor(app, blockchain) {
        this.app = app;
        this.blockchain = blockchain;
        this.getBlockByIndex();
        this.postNewBlock();
        this.getWelcomeMessage();
    }

    getWelcomeMessage() {
        this.app.get("/", async (req, res) => {
            res.end("Welcome to Private Blockchain")
        });
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", async (req, res) => {
            // Add your code here
            let block = await Blockchain.getBlock(req.params.index);
            if (undefined === block) {
                res.status(404);
                res.json({message: "Not Found"});

            }
            res.json(block);
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            if (req.body !== undefined && req.body !== "" && Object.keys(req.body).length !== 0) {
                let block = new Block(req.body);
                await this.blockchain.addBlock(block);
                res.status(201);
                res.json(block);
            } else {
                res.status(400);
                res.json({message: "Bad Request"});
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app
 */
module.exports = (app, blockchain) => {
    return new BlockController(app, blockchain);
};