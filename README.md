# Private Blockchain

This is a simple private blockchain based on Node.js, leveldb and Express.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install dependencies
```
npm install
```

## Testing library code

1: Open a command prompt or shell terminal after install node.js.
2: run main.js with node interpreter
```
node app/main.js
```

## Endpoints

### GET Block Endpoint
Configure a GET request using URL path with a block height parameter. The response for the endpoint provides block object is JSON format.

### URL
http://localhost:8000/block/[blockheight]

### Example URL path
http://localhost:8000/block/0, where '0' is the block height.

### Response
The response for the endpoint provides block object is JSON format.

### Example GET Response
For URL, http://localhost:8000/block/0
```
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 179
accept-ranges: bytes
Connection: close          
{"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}
```


## POST Block Endpoint
Post a new block with data payload option to add data to the block body. The block body supports a string of text. The response for the endpoint provides block object in JSON format.

### Response
The response for the endpoint provides block object in JSON format.

### Example POST response
For URL: http://localhost:8000/block

```
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 238
Connection: close
{"hash":"ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90","height":1,"body":"Testing block with test string data","time":"1531764891","previousBlockHash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"}
```

## Testing web code

1: Open a command prompt or shell terminal after install node.js.
2: run app.js with node interpreter

```
node app/app.js
```

3: Use POST to Create a Block
```
curl -i -H "Accept: application/json" -H "Content-Type: text/plain" --data "Some Data" -X POST  http://localhost:8000/block
```

4: Use GET to Get a Block
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET  http://localhost:8000/block/1

```
