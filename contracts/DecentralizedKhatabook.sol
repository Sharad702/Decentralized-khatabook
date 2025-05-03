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

    struct Product {
        string name;
        string description;
        uint256 quantity;
        uint256 price;
        bool exists;
    }

    mapping(address => Customer) public customers;
    mapping(address => Entry[]) public entries;
    mapping(uint256 => Product) public products;
    uint256 public productCount;
    address[] public customerAddresses;

    event CustomerAdded(address indexed customerAddress, string name, string mobileNumber);
    event EntryAdded(address indexed customerAddress, int256 amount, string description);
    event EntrySettled(address indexed customerAddress, uint256 entryIndex);
    event ProductAdded(uint256 indexed productId, string name, uint256 quantity, uint256 price);
    event ProductUpdated(uint256 indexed productId, uint256 quantity, uint256 price);

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

    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _quantity,
        uint256 _price
    ) public {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        productCount++;
        products[productCount] = Product({
            name: _name,
            description: _description,
            quantity: _quantity,
            price: _price,
            exists: true
        });

        emit ProductAdded(productCount, _name, _quantity, _price);
    }

    function updateProduct(
        uint256 _productId,
        uint256 _quantity,
        uint256 _price
    ) public {
        require(products[_productId].exists, "Product does not exist");
        require(_price > 0, "Price must be greater than 0");

        products[_productId].quantity = _quantity;
        products[_productId].price = _price;

        emit ProductUpdated(_productId, _quantity, _price);
    }

    function getProduct(uint256 _productId) public view returns (Product memory) {
        require(products[_productId].exists, "Product does not exist");
        return products[_productId];
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            if (products[i].exists) {
                allProducts[i - 1] = products[i];
            }
        }
        return allProducts;
    }

    function addEntryWithInventory(
        address _customerAddress,
        int256 _amount,
        string memory _description,
        uint256 _productId,
        uint256 _quantity
    ) public {
        require(customers[_customerAddress].exists, "Customer does not exist");
        require(products[_productId].exists, "Product does not exist");
        require(products[_productId].quantity >= _quantity, "Insufficient inventory");

        products[_productId].quantity -= _quantity;

        entries[_customerAddress].push(Entry({
            timestamp: block.timestamp,
            amount: _amount,
            description: _description,
            settled: false
        }));

        emit EntryAdded(_customerAddress, _amount, _description);
    }
}
