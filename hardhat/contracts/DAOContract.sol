// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract DAO {
    struct Proposal {
        address creator;
        string description;
        uint256 votes;
        bool executed;
    }

    struct Organization {
        string name;
        address[] apps;
    }

    struct App {
        address owner;
        address appAddress;
        uint256 votes;
    }

    mapping(address => bool) public isOrganization;
    mapping(address => bool) public isUser;
    mapping(address => Organization) public organizations;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => App) public appProposals;
    mapping (uint256 => mapping(address => bool)) hasVotedProposal;
    uint256 public numProposals;
    uint256 public numApps;

    mapping(address => uint256) public balances;

    event NewProposal(uint indexed id, address indexed creator, string description);
    event Vote(uint indexed id, address indexed voter);
    event ExecuteProposal(uint indexed id, address indexed executor);
    event RegisterOrganization(address indexed organization, string name);
    event SubmitApp(address indexed organization, address indexed app);
    
    modifier onlyOrganization() {
        require(isOrganization[msg.sender], "Only organizations can call this function");
        _;
    }
    
    modifier onlyUser() {
        require(isUser[msg.sender], "Only users can call this function");
        _;
    }

    function registerOrganization(string memory _name) external {
        require(!isOrganization[msg.sender], "Organization already registered");
        isOrganization[msg.sender] = true;
        organizations[msg.sender].name = _name;
        emit RegisterOrganization(msg.sender, _name);
    }

    function registerUser() external {
        require(!isUser[msg.sender], "User already registered");
        isUser[msg.sender] = true;
    }

    function submitApp(address _appAddress) external onlyOrganization {
        organizations[msg.sender].apps.push(_appAddress);
        appProposals[numApps] = App({
            owner: msg.sender,
            appAddress: _appAddress,
            votes: 0
        });
        emit SubmitApp(msg.sender, _appAddress);
    }

    function createProposal(string memory _description) external onlyUser {
        uint proposalId = numProposals++;
        proposals[proposalId] = Proposal({
            creator: msg.sender,
            description: _description,
            votes: 0,
            executed: false
        });
        emit NewProposal(proposalId, msg.sender, _description);
    }

    function voteProposal(uint _proposalId) external onlyUser {
        require(!hasVotedProposal[_proposalId][msg.sender], "Already voted");
        require(!proposals[_proposalId].executed, "Proposal executed");

        proposals[_proposalId].votes++;
        hasVotedProposal[_proposalId][msg.sender] = true;

        emit Vote(_proposalId, msg.sender);
    }

    function executeProposal(uint _proposalId) external {
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(proposals[_proposalId].votes > 0, "No votes for proposal");

        proposals[_proposalId].executed = true;

        emit ExecuteProposal(_proposalId, msg.sender);
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) external {
        require(_amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }
}
