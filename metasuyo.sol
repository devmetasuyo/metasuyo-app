// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract Metasuyo is ERC1155, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address private adminWallet;

    struct Attribute {
    string trait_type;
    string value;
    string display_type;
    }

    struct NFTData {
        string name;
        uint256 rarity;
        uint256 collectionId;
        string jsonData;
        string uri;
        string imageUri;
        uint256 price;
        uint256 duplicates;
    }

    struct CollectionData {
        string name;
        string description;
        string imageUri;
        uint256 nftCount;
        uint date;
    }

    mapping(uint256 => NFTData) public nftData;

    mapping(uint256 => CollectionData) public collections;

    mapping(uint256 => uint256) public nftPrices;

    mapping(bytes32 => bool) public usedUIDs;

    mapping(bytes32 => bool) public createdUIDs;

    mapping(uint256 => bool) public createdCollections;

    mapping(uint256 => string) private _tokenURIs;

    mapping(uint256 => string) private MtokenURIs;

    mapping(uint256 => address) private _tokenOwners;

    event NFTMinted(uint256 indexed tokenId, address indexed to);

    event CollectionCreated(uint256 indexed collectionId, string name);

    constructor(
        string memory _uri,
        address _adminWallet
    ) ERC1155(_uri) Ownable(_adminWallet) {
        adminWallet = _adminWallet;
    }

    function createCollection(
        string memory name,
        string memory description,
        string memory imageUri
    ) public onlyOwner {
        uint256 collectionId = _tokenIdCounter.current();

        collections[collectionId] = CollectionData(
            name,
            description,
            imageUri,
            0,
            block.timestamp
        );

        createdCollections[collectionId] = true;

        emit CollectionCreated(collectionId, name);

        _tokenIdCounter.increment();
    }

    function getCollectionData(
        uint256 collectionId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            string memory imageUri,
            uint256 nftCount,
            uint date
        )
    {
        CollectionData memory collection = collections[collectionId];
        return (
            collection.name,
            collection.description,
            collection.imageUri,
            collection.nftCount,
            collection.date
        );
    }

    /**
     * @dev Sets the address of the new admin wallet.
     * @param newAdmin The address of the new admin wallet.
     */
    function setAdminWallet(address newAdmin) public onlyOwner {
        adminWallet = newAdmin;
    }

    /**
     * @dev Generates a new unique identifier (UID).
     *@param uid The unique identifier to be generated.
     */
    function generateUID(bytes32 uid) public onlyOwner {
        require(msg.sender == adminWallet, "Only admin can generate UID");
        require(!createdUIDs[uid], "UID already created");
        createdUIDs[uid] = true;
    }

    function batchGenerateUID(bytes32[] memory uids) public onlyOwner {
        for (uint256 i = 0; i < uids.length; i++) {
            generateUID(uids[i]);
        }
    }

    /**
     * @dev Returns the names and IDs of all created collections.
     * @return An array of collection names and an array of collection IDs.
     */
    function getCollectionNames()
        public
        view
        returns (string[] memory, uint256[] memory)
    {
        string[] memory names = new string[](_tokenIdCounter.current());
        uint256[] memory ids = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;

        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (createdCollections[i]) {
                names[count] = collections[i].name;
                ids[count] = i;
                count++;
            }
        }

        // Resize arrays to remove unused slots
        string[] memory trimmedNames = new string[](count);
        uint256[] memory trimmedIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            trimmedNames[i] = names[i];
            trimmedIds[i] = ids[i];
        }

        return (trimmedNames, trimmedIds);
    }

    /**
     * @dev Retrieves the IDs of all NFTs in the specified collection.
     * @param collectionId The ID of the collection.
     * @return An array containing the IDs of all NFTs in the specified collection.
     */
    function getNFTsInCollection(uint256 collectionId) public view returns (uint256[] memory, string[] memory) {
    uint256[] memory tempResult = new uint256[](_tokenIdCounter.current());
    string[] memory tempUris = new string[](_tokenIdCounter.current());
    uint256 count = 0;

    // Iterates through all NFTs to find those belonging to the specified collection
    for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
        if (nftData[i].collectionId == collectionId) {
            tempResult[count] = i;
            tempUris[count] = nftData[i].imageUri;
            count++;
        }
    }

    // Creates a new array with the correct size
    uint256[] memory result = new uint256[](count);
    string[] memory uris = new string[](count);
    for (uint256 i = 0; i < count; i++) {
        result[i] = tempResult[i];
        uris[i] = tempUris[i];
    }

    return (result, uris);
}

    /**
     * @dev Mints a new NFT.
     * @param to The address to mint the NFT to.
     * @param collectionId The ID of the collection the NFT belongs to.
     * @param name The name of the NFT.
     * @param rarity The rarity of the NFT.
     * @param jsonData The JSON data of the NFT.
     * @param _uri The URI of the NFT.
     * @param imageUri The URI of the NFT's image.
     * @param uid The unique identifier of the NFT.
     * @param price The price of the NFT.
     * @param duplicates The number of duplicates of the NFT.
     */
    function mintNFT(
    address to,
    uint256 collectionId,
    string memory name,
    uint256 rarity,
    string memory jsonData,
    string memory _uri,
    string memory imageUri,
    bytes32 uid,
    uint256 price,
    uint256 duplicates
) public {
        require(!usedUIDs[uid], "UID already used");
        require(createdUIDs[uid], "UID not created");
        require(createdCollections[collectionId], "Collection not created");

        uint256 tokenId = _tokenIdCounter.current();

        _mint(to, tokenId, 1, "");
        _tokenOwners[tokenId] = to;

        nftData[tokenId] = NFTData(
            name,
            rarity,
            collectionId,
            jsonData,
            _uri,
            imageUri,
            price,
            duplicates 
        );

        collections[collectionId].nftCount += 1;
        usedUIDs[uid] = true;
        _tokenURIs[tokenId] = _uri;
        MtokenURIs[tokenId] = imageUri;

        emit NFTMinted(tokenId, to);

        _tokenIdCounter.increment();
    }

    /**
     * @dev Sets the price of an NFT.
     * @param tokenId The ID of the NFT.
     * @param price The new price of the NFT.
     */
    function setPrice(uint256 tokenId, uint256 price) public {
        require(balanceOf(msg.sender, tokenId) > 0, "Not owner of token");

        nftPrices[tokenId] = price;
    }

    /**
     * @dev Transfers an NFT from one address to another.
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param tokenId The ID of the NFT.
     */
    function transferNFT(address from, address to, uint256 tokenId) public {
        require(balanceOf(from, tokenId) > 0, "Not owner of token");

        safeTransferFrom(from, to, tokenId, 1, "");

        _tokenOwners[tokenId] = to;

        delete nftPrices[tokenId];
    }

    /**
     * @dev Allows a user to buy an NFT.
     * @param tokenId The ID of the NFT.
     */
    function buyNFT(uint256 tokenId) public payable {
        require(nftPrices[tokenId] > 0, "NFT not for sale");

        require(msg.value >= nftPrices[tokenId], "Insufficient funds");

        address owner = msg.sender;

        payable(owner).transfer(msg.value);

        safeTransferFrom(owner, msg.sender, tokenId, 1, "");

        _tokenOwners[tokenId] = msg.sender;

        delete nftPrices[tokenId];
    }

    /**
     * @dev Returns the URI of an NFT.
     * @param tokenId The ID of the NFT.
     * @return The URI of the NFT.
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(
            bytes(nftData[tokenId].name).length > 0,
            "ERC1155Metadata: URI query for nonexistent token"
        );

        return _tokenURIs[tokenId];
    }

    /**
     * @dev Returns the URI of the image of an NFT.
     * @param tokenId The ID of the NFT.
     * @return The URI of the NFT's image.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(
            bytes(nftData[tokenId].name).length > 0,
            "ERC1155Metadata: URI query for nonexistent token"
        );

        return MtokenURIs[tokenId];
    
        }

    /**
     * @dev Returns the owner of an NFT.
     * @param tokenId The ID of the NFT.
     * @return The address of the NFT's owner.
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _tokenOwners[tokenId];
        require(
            owner != address(0),
            "ERC1155: owner query for nonexistent token"
        );
        return owner;
    }

    /**
     * @dev Clones an NFT.
     * @param tokenId The ID of the NFT to clone.
     * @param uid The unique identifier of the clone.
     * @return The ID of the cloned NFT.
     */
    function clone_nft(uint256 tokenId, bytes32 uid) public returns (uint256) {
    require(nftData[tokenId].duplicates > 0, "No duplicates available");
    require(createdUIDs[uid], "UID not created");
    require(!usedUIDs[uid], "UID already used");

    uint256 newTokenId = _tokenIdCounter.current();
    _mint(msg.sender, newTokenId, 1, "");
    _tokenOwners[newTokenId] = msg.sender;

    nftData[newTokenId] = NFTData(
        nftData[tokenId].name,
        nftData[tokenId].rarity,
        nftData[tokenId].collectionId,
        nftData[tokenId].jsonData,
        nftData[tokenId].uri,
        nftData[tokenId].imageUri,
        nftData[tokenId].price,
        0
    );

    nftData[tokenId].duplicates -= 1;

    _tokenURIs[newTokenId] = nftData[tokenId].uri;

    MtokenURIs[newTokenId] = nftData[tokenId].imageUri;

    usedUIDs[uid] = true;

    _tokenIdCounter.increment();

    return newTokenId;
}
}