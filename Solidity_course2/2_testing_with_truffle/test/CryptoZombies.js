const CryptoZombies = artifacts.require("CryptoZombies");
const utils = require("./helpers/utils");
const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {
    //1. initialize `alice` and `bob`, placeholder names
    let [alice, bob] = accounts;

    let contractInstance;
    // create instance of contract before each test
    beforeEach(async () => {
        contractInstance = await CryptoZombies.new();
    });

    it("should be able to create a new zombie", async () => {
      const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
      // is the transaction successful?
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.name, zombieNames[0]);
    })

    it("should not allow two zombies", async () => {
      await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
      await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })
})
