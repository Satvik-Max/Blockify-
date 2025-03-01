// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerifier {
    address public admin;

    struct Document {
        string name;
        string documentHash;
        address student;
    }

    Document[] public documents;
    mapping(address => uint[]) public studentDocuments;

    event DocumentIssued(address indexed student, string name, string documentHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueDocument(address _student, string memory _name, string memory _documentHash) public onlyAdmin {
        documents.push(Document(_name, _documentHash, _student));
        studentDocuments[_student].push(documents.length - 1);
        emit DocumentIssued(_student, _name, _documentHash);
    }

    function getStudentDocuments(address _student) public view returns (Document[] memory) {
        uint count = studentDocuments[_student].length;
        Document[] memory result = new Document[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = documents[studentDocuments[_student][i]];
        }
        return result;
    }

    function getAllDocuments() public view onlyAdmin returns (Document[] memory) {
        return documents;
    }
}
