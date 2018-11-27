const should = require("should");
const assert = require("assert");
const supertest = require("supertest");
const Block = require('../block.js').Block;
const BlockAPI = require('../../app').BlockAPI;
const Blockchain = require('../blockchain').Blockchain;

describe("BlockController", function () {
    describe("Add Block", function () {
        let blockAPI;
        beforeEach(async function () {
            const blockchain = new Blockchain();
            await blockchain.init();
            blockAPI = new BlockAPI(blockchain);
        });
        it("should create a block", function (done) {
            const block = new Block("Testblock");
            supertest(blockAPI.app)
                .post("/block")
                .send(block)
                .expect(201)
                .end(done)
        })
    })
});
