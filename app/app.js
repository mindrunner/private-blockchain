//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");
const Blockchain = require('./src/blockchain').Blockchain;

/**
 * Class Definition for the REST API
 */
exports.BlockAPI = class BlockAPI {

    /**
     * Constructor that allows initialize the class
     */
    constructor(blockchain) {
        this.app = express();
        this.blockchain = blockchain;
        this.initExpress();
        this.initExpressMiddleWare();
        this.initControllers();
        // this.start();
    }

    /**
     * Initilization of the Express framework
     */
    initExpress() {
        this.app.set("port", 8000);
    }

    /**
     * Initialization of the middleware modules
     */
    initExpressMiddleWare() {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.text());
    }

    /**
     * Initilization of all the controllers
     */
    initControllers() {
        require("./src/BlockController.js")(this.app, this.blockchain);
    }

    /**
     * Starting the REST Api application
     */
    start() {
        let self = this;
        return this.app.listen(this.app.get("port"), () => {
            console.log(`Server Listening for port: ${self.app.get("port")}`);
        });
    }
};

const blockchain = new Blockchain();
blockchain.init().then(() => {
    new exports.BlockAPI(blockchain).start();
});
