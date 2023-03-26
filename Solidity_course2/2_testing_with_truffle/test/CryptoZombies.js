const CryptoZombies = artifacts.require("CryptoZombies");
const utils = require("./helpers/utils");
const time = require("./helpers/time");
// import expect from chai
var expect = require('chai').expect;
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
      /* expect versions
       * expect(result.receipt.status).to.equal(true);
       * expect(result.logs[0].args.name).to.equal(zombieNames[0]);
       */
    })

    it("should not allow two zombies", async () => {
      await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
      await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })

    context("with the single-step transfer scenario", async () => {
      it("should transfer a zombie", async () => {
        // Test the single-step transfer scenario.
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber(); // retrieve zombieId
        await contractInstance.transferFrom(alice, bob, zombieId, {from: alice}); // Alice calls transferFrom
        const newOwner = await contractInstance.ownerOf(zombieId);
        assert.equal(newOwner, bob);  // expect(newOwner).to.equal(bob);
      })
    })
  
    context("with the two-step transfer scenario", async () => {
      it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
        // Test the two-step scenario.  The approved address calls transferFrom
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        // alice approves bob to transfer the token
        await contractInstance.approve(bob, zombieId, {from: alice});
        // bob calls transferFrom
        await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
        const newOwner = await contractInstance.ownerOf(zombieId);
        assert.equal(newOwner,bob);  // expect(newOwner).to.equal(bob);
      })
      it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
          // Test the two-step scenario.  The owner calls transferFrom
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        // alice approves bob to transfer the token
        await contractInstance.approve(bob, zombieId, {from: alice});
        // bob calls transferFrom
        await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
        const newOwner = await contractInstance.ownerOf(zombieId);
        assert.equal(newOwner,bob);  // expect(newOwner).to.equal(bob);
      })
    })

    it.skip("zombies should be able to attack another zombie", async () => {
      let result;
      result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
      const firstZombieId = result.logs[0].args.zombieId.toNumber();
      result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
      const secondZombieId = result.logs[0].args.zombieId.toNumber();
      // increase the time
      await time.increase(time.duration.days(1));
      await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
      assert.equal(result.receipt.status, true);  // expect(result.receipt.status).to.equal(true);
  })
})
