const CryptoZombies = artifacts.require("CryptoZombies");
const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {
    //1. initialize `alice` and `bob`, placeholder names
    let [alice, bob] = accounts;
    it("should be able to create a new zombie", async () => {
      // create instance of contract
      const contractInstance = await CryptoZombies.new();
      const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
      // is the transaction successful?
      assert.equal(result.receipt.status, true);
      assert.equal(result.logs[0].args.name, zombieNames[0]);
    })
})
