import { SupportedProvider, Web3Wrapper } from "@0x/web3-wrapper";
import { HttpClient } from "@0x/connect";
import { Order, SignedOrder } from "@0x/types";
import { BigNumber } from "@0x/utils";
import { getOrderHash } from "@0x/order-utils";
import Web3 from "web3";

export async function sell(
  provider,
  sellingPrice: BigNumber,
  sellingVolume: BigNumber
) {
  try {
    const web3Wrapper = new Web3Wrapper(provider);
    const httpClient = new HttpClient("https://api.0x.org");
    const makerAddress = "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5"; // No fee recipient

    const order: Order = {
      chainId: 1, // Ethereum Mainnet
      exchangeAddress: "0x4f833a24e1f95d70f028921e27040ca56e09ab0b", // 0x Exchange address
      makerAddress: makerAddress, // Your wallet address
      takerAddress: "0x0000000000000000000000000000000000000000", // Any taker can fill this order
      feeRecipientAddress: "0x0000000000000000000000000000000000000000", // Fees paid to the order maker
      senderAddress: "0x0000000000000000000000000000000000000000", // Allows arbitrary address to call fillOrder
      makerAssetAmount: new BigNumber("1000000000000000000"), // Amount of tokens you want to sell
      takerAssetAmount: new BigNumber("200000000000000000000"), // Amount of tokens you want to buy in exchange
      makerFee: sellingVolume,
      takerFee: sellingPrice,
      expirationTimeSeconds: new BigNumber(Date.now() + 86400000), // 1 day expiration time
      salt: new BigNumber(Date.now()),
      makerAssetData: "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5", // ERC20 token address of the token you want to sell
      takerAssetData: "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5", // ERC20 token address of the token you want to buy
      makerFeeAssetData: "0x",
      takerFeeAssetData: "0x",
    };

    // Sign the order hash
    // const orderHash = getOrderHash(order);
    const signature = await web3Wrapper.signMessageAsync(
      makerAddress,
      Web3.utils.keccak256("Selling at Price Order")
    );

    // Add the signature to the order
    const signedOrder: SignedOrder = {
      ...order,
      signature,
    };

    console.log("Hello World");

    // Submit the order to the 0x API
    const response = await httpClient.submitOrderAsync(signedOrder);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
