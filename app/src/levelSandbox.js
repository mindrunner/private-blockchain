'use strict';

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

exports.addLevelDBData = function addLevelDBData(key, value) {
    try {
        db.put(key, value);
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

// function addDataToLevelDB(value) {
//     let i = 0;
//     db.createReadStream().on('data', function (data) {
//         i++;
//     }).on('error', function (err) {
//         return console.log('Unable to read data stream!', err)
//     }).on('close', function () {
//         console.log('Block #' + i);
//         addLevelDBData(i, value);
//     });
// }
