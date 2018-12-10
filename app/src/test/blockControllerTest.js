const should = require("should");
const assert = require("assert");
const supertest = require("supertest");
const bitcoin = require("bitcoinjs-lib");
const bitcoinMessage = require("bitcoinjs-message");
const RequestObject = require("../requestObject").RequestObject;
const Block = require('../block.js').Block;
const BlockAPI = require('../../app').BlockAPI;
const Blockchain = require('../blockchain').Blockchain;


const testAddress = "16r7Wz413PvSAQmrsopvs2gJwPbcddc9Sm";
const keyPair = bitcoin.ECPair.fromWIF('KwvZLcJAomJtui1VaNpbeJ8DY2MJoCcu6SJivw3NZFFkLWW473ka');
const privateKey = keyPair.privateKey;
var signature = null;

describe("BlockController", function () {
    describe("Add Block", function () {
        let blockAPI;
        before(async function () {
            const blockchain = new Blockchain();
            await blockchain.init();
            blockAPI = new BlockAPI(blockchain);
        });
        it("creates a validation request", function (done) {
            supertest(blockAPI.app)
                .post("/requestValidation")
                .send({address: testAddress})
                .expect((res) => {
                    if (!('validationWindow' in res.body)) throw new Error("missing next key");
                    if (!(res.body.validationWindow === 300)) throw new Error("wrong validation window");
                    signature = bitcoinMessage.sign(res.body.message, privateKey, keyPair.compressed)
                })
                .end(done)
        });

        it("creates a star", function (done) {
            let star = {
                "address": testAddress,
                "star": {
                    "dec": "68° 52' 56.9",
                    "ra": "16h 29m 1.0s",
                    "story": "Found star using https://www.google.com/sky/"
                }
            };

            supertest(blockAPI.app)
                .post("/block")
                .send(star)
                .expect((res) => {
                    if (!('storyDecoded' in res.body)) throw new Error("missing decoded story");
                })
                .end(done)
        });
    })
});
