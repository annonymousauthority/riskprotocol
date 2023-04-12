// contracts/OceanToken.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RiskProtocol is ERC20Capped, ERC20Burnable, Pausable, Ownable {
    using SafeMath for uint256;

    uint256 public blockReward;

    constructor(
        uint256 cap, uint256 reward
    ) ERC20("RiskProtocol", "RPC") ERC20Capped(cap * (10 ** decimals())) {
        _mint(msg.sender, 700 * (10 ** decimals()));
         blockReward = reward * (10 ** decimals());
    }

    event Rebase(uint256 indexed epoch, uint256 totalSupply);

    function rebase(
        uint256 epoch,
        uint256 supplyDelta
    ) public onlyOwner returns (uint256) {
        if (supplyDelta == 0) {
            emit Rebase(epoch, ERC20.totalSupply());
            return totalSupply();
        }

        uint256 multiplier = 10 ** decimals();

        if (supplyDelta < 0) {
            require(
                totalSupply().mul(multiplier).div(multiplier - supplyDelta) <=
                    cap(),
                "Cannot decrease supply beyond cap"
            );
        }

        uint256 newSupply = totalSupply().mul(multiplier).div(
            multiplier + supplyDelta
        );

        require(
            newSupply >= 300 * (10 ** decimals()),
            "Cannot decrease supply below minimum"
        );

        uint256 rebaseAmount = newSupply.sub(totalSupply());

        emit Rebase(epoch, rebaseAmount);

        return newSupply;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20Capped, ERC20) {
        require(
            ERC20.totalSupply() + amount <= cap(),
            "ERC20Capped: cap exceeded"
        );
        super._mint(account, amount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (
            from != address(0) &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function destroy() public onlyOwner {
        selfdestruct(payable(msg.sender));
    }
}
