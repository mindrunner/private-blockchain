# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

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
