'use strict';

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

exports.addLevelDBData = async function addLevelDBData(key, value) {
    try {
        await db.put(key, value);
    } catch (e) {
        console.log('Block ' + key + ' submission failed', e);
    }
};

exports.getLevelDBData = async function getLevelDBData(key) {
    try {
        let value = await db.get(key);
        // console.log('Value = ' + value);
        return value;
    } catch (e) {
        return undefined;
    }
};

exports.getLastKey = async function getLastKey() {
    let max = 0;
    while (true)
        if (undefined === await this.getLevelDBData(max++))
            return max - 2;
};

exports.getBlocksByWalletAddress = async function getBlocksByWalletAddress(address) {
    let blocks = [];
    return new Promise(function (resolve, reject) {
        db.createValueStream()
            .on('data', function (data) {
                let b = JSON.parse(data);
                //compatibility
                // if (Object.getPrototypeOf(b.body) === String.prototype) return;
                if(b.height === 0) return;
                if (b.body.address === address) {
                    blocks.push(b);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(blocks);
            });
    });
};

exports.getBlockByHash = async function getBlockByHash(hash) {
    let block = null;
    return new Promise(function (resolve, reject) {
        db.createValueStream()
            .on('data', function (data) {

                let b = JSON.parse(data);
                if (b.hash === hash) {
                    block = b;
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
    });
};
