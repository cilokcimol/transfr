// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Escrow
 * @notice Holds ETH deposits mapped to claim IDs.
 *         A sender deposits ETH with a unique claimId.
 *         The intended recipient can later claim the funds.
 */
contract Escrow {
    struct Deposit {
        address depositor;
        uint256 amount;
        bool claimed;
    }

    mapping(bytes32 => Deposit) public deposits;

    event Deposited(bytes32 indexed claimId, address indexed depositor, uint256 amount);
    event Claimed(bytes32 indexed claimId, address indexed recipient, uint256 amount);

    /**
     * @notice Deposit ETH into escrow with a unique claim ID.
     * @param claimId Unique identifier for this deposit.
     */
    function deposit(bytes32 claimId) external payable {
        require(msg.value > 0, "Must send ETH");
        require(deposits[claimId].amount == 0, "Claim ID already used");

        deposits[claimId] = Deposit({
            depositor: msg.sender,
            amount: msg.value,
            claimed: false
        });

        emit Deposited(claimId, msg.sender, msg.value);
    }

    /**
     * @notice Claim deposited ETH.
     * @param claimId The claim ID to claim funds for.
     * @param recipient The address to send funds to.
     */
    function claim(bytes32 claimId, address payable recipient) external {
        Deposit storage d = deposits[claimId];
        require(d.amount > 0, "No deposit found");
        require(!d.claimed, "Already claimed");

        d.claimed = true;
        uint256 amount = d.amount;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit Claimed(claimId, recipient, amount);
    }

    /**
     * @notice Get deposit details for a claim ID.
     * @param claimId The claim ID to look up.
     * @return depositor The address that made the deposit.
     * @return amount The amount deposited in wei.
     * @return claimed Whether the deposit has been claimed.
     */
    function getDeposit(bytes32 claimId) external view returns (
        address depositor,
        uint256 amount,
        bool claimed
    ) {
        Deposit memory d = deposits[claimId];
        return (d.depositor, d.amount, d.claimed);
    }
}
