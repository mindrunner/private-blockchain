const bitcoin = require("bitcoinjs-lib");
const RequestObject = require("./requestObject").RequestObject;
const Block = require('./block.js').Block;
const Blockchain = require('./blockchain.js').Blockchain;
const util = require('util');
const Star = require("./star").Star;
const ValidRequest = require("./validRequest").ValidRequest;

const TimeoutRequestsWindowTime = 5 * 60 * 1000;

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
        this.mempool = [];
        this.mempoolValid = [];
        this.timeoutRequests = [];
        this.getBlockByIndex();
        this.postNewBlock();
        this.getWelcomeMessage();
        this.requestValidation();
        this.validateMessage();
        this.getBlockByHash();
        this.getBlocksByWalletAddress()
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

            block.body.star.storyDecoded = Buffer.from(block.body.star.story, "hex").toString("ascii");
            res.json(block);
        });
    }

    getBlocksByWalletAddress() {
        this.app.get("/stars/address::address", async (req, res) => {
            // Add your code here
            let blocks = await Blockchain.getBlocksByWalletAddress(req.params.address);
            if (blocks.length === 0) {
                res.status(404);
                res.json({message: "Not Found"});
                return;
            }

            blocks.forEach((block) => {

                block.body.star.storyDecoded = Buffer.from(block.body.star.story, "hex").toString("ascii");

            });

            res.json(blocks);
        });
    }
    getBlockByHash() {
        this.app.get("/stars/hash::hash", async (req, res) => {
            // Add your code here
            let block = await Blockchain.getBlockByHash(req.params.hash);
            if (undefined === block) {
                res.status(404);
                res.json({message: "Not Found"});
                return;
            }

            block.body.star.storyDecoded = Buffer.from(block.body.star.story, "hex").toString("ascii");
            res.json(block);
        });
    }
    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            if (req.body !== undefined && req.body !== "" && Object.keys(req.body).length !== 0) {

                if (req.body.address in this.mempoolValid) {
                    let star = new Star();
                    star.cen = req.body.star.cen;
                    star.ra = req.body.star.ra;
                    star.dec = req.body.star.dec;
                    star.mag = req.body.star.mag;

                    let body = {
                        address: req.body.address,
                        star: {
                            ra: req.body.star.ra,
                            dec: req.body.star.dec,
                            mag: req.body.star.mag | null,
                            cen: req.body.star.cen | null,
                            story: Buffer.from(req.body.star.story, 'ascii').toString('hex')
                        }
                    };
                    let block = new Block(body);
                    await this.blockchain.addBlock(block);

                    block.body.star.storyDecoded = Buffer.from(block.body.star.story, "hex").toString("ascii");


                    res.status(201);
                    res.json(block);
                } else {
                    res.status(404);
                    res.json({message: "Request not found!"});
                }
            } else {
                res.status(400);
                res.json({message: "Bad Request"});
            }


        });
    }

    removeValidationRequest(walletAddress) {
        delete this.mempool[walletAddress];
        delete this.timeoutRequests[walletAddress];
    }

    addValidationRequest(requestObject) {
        let self = this;
        this.mempool[requestObject.walletAddress] = requestObject;
        this.timeoutRequests[requestObject.walletAddress] = setTimeout(function () {
            self.removeValidationRequest(requestObject.walletAddress)
        }, TimeoutRequestsWindowTime);
    }


    /**
     */
    requestValidation() {
        let self = this;
        this.app.post("/requestValidation", async (req, res) => {
            if (req.body !== undefined && req.body !== "" && Object.keys(req.body).length !== 0) {
                try {
                    bitcoin.address.toOutputScript(req.body.address, bitcoin.networks.bitcoin);
                } catch (e) {
                    res.status(400);
                    res.json({message: "Address invalid or missing"});
                    return;
                }

                let requestObject = null;

                if (req.body.address in this.mempool) {
                    requestObject = self.mempool[req.body.address];
                } else {
                    requestObject = new RequestObject();
                    requestObject.walletAddress = req.body.address;
                    requestObject.requestTimeStamp = new Date().getTime().toString().slice(0, -3);
                    requestObject.message = util.format("%s:%s:%s", req.body.address, requestObject.requestTimeStamp, "starRegistry");
                    self.addValidationRequest(requestObject);
                }

                let timeElapse = (new Date().getTime().toString().slice(0, -3)) - requestObject.requestTimeStamp;
                requestObject.validationWindow = (TimeoutRequestsWindowTime / 1000) - timeElapse;

                res.status(201);
                res.json(requestObject);
            } else {
                res.status(400);
                res.json({message: "Bad Request"});
            }
        });
    }


    /**
     */
    validateMessage() {
        this.app.post("/message-signature/validate", async (req, res) => {
            if (
                req.body !== undefined
                && req.body !== ""
                && req.body.address !== undefined
                && req.body.address !== ""
                && req.body.signature !== undefined
                && req.body.signature !== ""
                && Object.keys(req.body).length !== 0
            ) {

                let address = req.body.address;
                let signature = req.body.signature;
                if (address in this.mempool) {
                    let requestObject = this.mempool[address];
                    const bitcoinMessage = require('bitcoinjs-message');
                    let isValid = false;
                    try {
                        isValid = bitcoinMessage.verify(requestObject.message, address, signature);
                    } catch (e) {
                        res.status(400);
                        res.json({message: e.message});
                        return;
                    }

                    let validRequest = new ValidRequest();
                    requestObject.messageSignature = isValid;
                    validRequest.status = requestObject;

                    let timeElapse = (new Date().getTime().toString().slice(0, -3)) - requestObject.requestTimeStamp;
                    requestObject.validationWindow = (TimeoutRequestsWindowTime / 1000) - timeElapse;

                    if (isValid) {
                        this.mempoolValid[address] = validRequest;
                        this.removeValidationRequest(address);

                        res.status(201);
                        res.json(validRequest);
                    } else {
                        res.status(400);
                        res.json({message: "Bad Signature"});
                    }
                } else {
                    res.status(404);
                    res.json({message: "Request not found!"});
                }
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