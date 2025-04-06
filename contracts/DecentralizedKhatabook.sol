// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedKhatabook {
    struct Customer {
        string name;
        bool exists;
        string mobileNumber;
    }

    struct Entry {
        int256 amount;
        string description;
        uint256 timestamp;
        bool settled;
    }

    mapping(address => Customer) public customers;
    mapping(address => Entry[]) public entries;
    address[] public customerAddresses;

    event CustomerAdded(address indexed customerAddress, string name, string mobileNumber);
    event EntryAdded(address indexed customerAddress, int256 amount, string description);
    event EntrySettled(address indexed customerAddress, uint256 entryIndex);

    function addCustomer(address _customerAddress, string memory _name, string memory _mobileNumber) public {
        require(!customers[_customerAddress].exists, "Customer already exists");
        require(_customerAddress != address(0), "Invalid customer address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_mobileNumber).length == 10, "Mobile number must be 10 digits");

        customers[_customerAddress] = Customer({
            name: _name,
            exists: true,
            mobileNumber: _mobileNumber
        });
        customerAddresses.push(_customerAddress);

        emit CustomerAdded(_customerAddress, _name, _mobileNumber);
    }

    function addEntry(address _customerAddress, int256 _amount, string memory _description) public {
        require(customers[_customerAddress].exists, "Customer does not exist");

        entries[_customerAddress].push(Entry({
            timestamp: block.timestamp,
            amount: _amount,
            description: _description,
            settled: false
        }));

        emit EntryAdded(_customerAddress, _amount, _description);
    }

    function settleEntry(address _customerAddress, uint256 _entryIndex) public {
        require(customers[_customerAddress].exists, "Customer does not exist");
        require(_entryIndex < entries[_customerAddress].length, "Invalid entry index");

        entries[_customerAddress][_entryIndex].settled = true;

        emit EntrySettled(_customerAddress, _entryIndex);
    }

    function getEntries(address _customerAddress) public view returns (Entry[] memory) {
        require(customers[_customerAddress].exists, "Customer does not exist");
        return entries[_customerAddress];
    }

    function getBalance(address _customerAddress) public view returns (int256 balance) {
        require(customers[_customerAddress].exists, "Customer does not exist");

        Entry[] memory customerEntries = entries[_customerAddress];

        for (uint i = 0; i < customerEntries.length; i++) {
            if (!customerEntries[i].settled) {
                balance += customerEntries[i].amount;
            }
        }

        return balance;
    }

    function getCustomers() public view returns (Customer[] memory) {
        Customer[] memory customerArray = new Customer[](customerAddresses.length);
        for (uint i = 0; i < customerAddresses.length; i++) {
            customerArray[i] = customers[customerAddresses[i]];
        }
        return customerArray;
    }

    function getCustomerAddresses() public view returns (address[] memory) {
        return customerAddresses;
    }
}
