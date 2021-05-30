//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./uniswapV2Core/interfaces/IUniswapV2Pair.sol";

contract USD is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    function getPrice(address pairAddress, uint256 amount)
        public
        view
        returns (uint256)
    {
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint256 Res0, uint256 Res1, ) = pair.getReserves();

        // decimals
        uint256 res0 = Res0 * (10**this.decimals());
        return ((amount * res0) / Res1); // return amount of token0 needed to buy token1
    }
}
