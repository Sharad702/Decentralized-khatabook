const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedKhatabook", function () {
  let Khatabook;
  let khatabook;
  let owner;
  let customer1;
  let customer2;

  beforeEach(async function () {
    [owner, customer1, customer2] = await ethers.getSigners();
    Khatabook = await ethers.getContractFactory("DecentralizedKhatabook");
    khatabook = await Khatabook.deploy();
    await khatabook.waitForDeployment();
  });

  describe("Customer Management", function () {
    it("Should add a new customer", async function () {
      const customerName = "John Doe";
      await khatabook.addCustomer(customer1.address, customerName);
      
      const customers = await khatabook.getCustomers();
      expect(customers.length).to.equal(1);
      expect(customers[0].customerAddress).to.equal(customer1.address);
      expect(customers[0].name).to.equal(customerName);
      expect(customers[0].exists).to.equal(true);
    });

    it("Should not add the same customer twice", async function () {
      await khatabook.addCustomer(customer1.address, "John Doe");
      await expect(
        khatabook.addCustomer(customer1.address, "John Doe")
      ).to.be.revertedWith("Customer already exists");
    });

    it("Should get all customers for a merchant", async function () {
      await khatabook.addCustomer(customer1.address, "John Doe");
      await khatabook.addCustomer(customer2.address, "Jane Smith");
      
      const customers = await khatabook.getCustomers();
      expect(customers.length).to.equal(2);
    });

    it("Different merchants should have different customer lists", async function () {
      await khatabook.addCustomer(customer1.address, "John Doe");
      
      // Connect as customer1 and add their own customer
      const khatabookAsCustomer1 = khatabook.connect(customer1);
      await khatabookAsCustomer1.addCustomer(customer2.address, "Jane Smith");

      const ownerCustomers = await khatabook.getCustomers();
      const customer1Customers = await khatabookAsCustomer1.getCustomers();

      expect(ownerCustomers.length).to.equal(1);
      expect(customer1Customers.length).to.equal(1);
      expect(ownerCustomers[0].customerAddress).to.equal(customer1.address);
      expect(customer1Customers[0].customerAddress).to.equal(customer2.address);
    });
  });

  describe("Entry Management", function () {
    const ENTRY_AMOUNT = ethers.parseEther("1.5"); // 1.5 ETH
    const ENTRY_DESCRIPTION = "Test Entry";

    beforeEach(async function () {
      await khatabook.addCustomer(customer1.address, "John Doe");
    });

    it("Should add an entry for a customer", async function () {
      await khatabook.addEntry(customer1.address, ENTRY_AMOUNT, ENTRY_DESCRIPTION);
      
      const entries = await khatabook.getEntries(customer1.address);
      expect(entries.length).to.equal(1);
      expect(entries[0].amount).to.equal(ENTRY_AMOUNT);
      expect(entries[0].description).to.equal(ENTRY_DESCRIPTION);
      expect(entries[0].settled).to.equal(false);
    });

    it("Should not add an entry for non-existent customer", async function () {
      await expect(
        khatabook.addEntry(customer2.address, ENTRY_AMOUNT, ENTRY_DESCRIPTION)
      ).to.be.revertedWith("Customer does not exist");
    });

    it("Should calculate balance correctly", async function () {
      await khatabook.addEntry(customer1.address, ENTRY_AMOUNT, "Credit");
      await khatabook.addEntry(customer1.address, ethers.parseEther("-0.5"), "Debit");
      
      const balance = await khatabook.getBalance(customer1.address);
      expect(balance).to.equal(ethers.parseEther("1.0")); // 1.5 - 0.5 = 1.0
    });

    it("Should settle an entry", async function () {
      await khatabook.addEntry(customer1.address, ENTRY_AMOUNT, ENTRY_DESCRIPTION);
      await khatabook.settleEntry(customer1.address, 0);
      
      const entries = await khatabook.getEntries(customer1.address);
      expect(entries[0].settled).to.equal(true);
      
      const balance = await khatabook.getBalance(customer1.address);
      expect(balance).to.equal(0n); // Balance should be 0 after settling
    });

    it("Should not settle non-existent entry", async function () {
      await expect(
        khatabook.settleEntry(customer1.address, 0)
      ).to.be.revertedWith("Invalid entry index");
    });
  });

  describe("Events", function () {
    it("Should emit CustomerAdded event", async function () {
      await expect(khatabook.addCustomer(customer1.address, "John Doe"))
        .to.emit(khatabook, "CustomerAdded")
        .withArgs(owner.address, customer1.address, "John Doe");
    });

    it("Should emit EntryAdded event", async function () {
      const amount = ethers.parseEther("1.0");
      await khatabook.addCustomer(customer1.address, "John Doe");
      
      await expect(khatabook.addEntry(customer1.address, amount, "Test Entry"))
        .to.emit(khatabook, "EntryAdded")
        .withArgs(owner.address, customer1.address, amount, "Test Entry");
    });

    it("Should emit EntrySettled event", async function () {
      await khatabook.addCustomer(customer1.address, "John Doe");
      await khatabook.addEntry(customer1.address, ethers.parseEther("1.0"), "Test Entry");
      
      await expect(khatabook.settleEntry(customer1.address, 0))
        .to.emit(khatabook, "EntrySettled")
        .withArgs(owner.address, customer1.address, 0);
    });
  });
}); 