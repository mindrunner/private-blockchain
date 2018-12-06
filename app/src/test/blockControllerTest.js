const should = require("should");
const assert = require("assert");
const supertest = require("supertest");
const RequestObject = require("../requestObject").RequestObject;
const Block = require('../block.js').Block;
const BlockAPI = require('../../app').BlockAPI;
const Blockchain = require('../blockchain').Blockchain;

describe("BlockController", function () {
    describe("Add Block", function () {
        let blockAPI;
        before(async function () {
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
        });
        it("creates a validation request", function (done) {
            supertest(blockAPI.app)
                .post("/requestValidation")
                .send({address: "bc1q0p0s8zj52racv9llx2f9nxtsvhmcyuela6utmn"})
                .expect((res) => {
                    if (!('validationWindow' in res.body)) throw new Error("missing next key");
                    if (!(res.body.validationWindow === 300)) throw new Error("wrong validation window");
                })
                .end(done)
        });

        it("creates another validation request", function (done) {
            supertest(blockAPI.app)
                .post("/requestValidation")
                .send({address: "bc1q0p0s8zj52racv9llx2f9nxtsvhmcyuela6utmn"})
                .expect((res) => {
                    if (!('validationWindow' in res.body)) throw new Error("missing next key");
                    if (!(res.body.validationWindow === 300)) throw new Error("wrong validation window");
                })
                .end(done)
        })
    })
});
