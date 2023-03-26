# Build an Oracle

initialize new project : `npm init -y`
install some dependecies `npm i truffle openzeppelin-solidity loom-js loom-truffle-provider bn.js axios`
We use Truffle to compile and deploy smart contracts to Loom testnet.


The oracle will live in the `oracle` directory: `mkdir oracle && cd oracle && npx truffle init && cd ..`
The caller contract will live in the `caller` directory: `mkdir caller && cd caller && npx truffle init && cd ..`

Directory structure should look like: `tree -L 2 -I node_modules`
.
├── caller
│   ├── contracts
│   ├── migrations
│   ├── test
│   └── truffle-config.js
├── oracle
│   ├── contracts
│   ├── migrations
│   ├── test
│   └── truffle-config.js
└── package.json