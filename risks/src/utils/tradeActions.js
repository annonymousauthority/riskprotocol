import { HttpClient } from "@0x/connect";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { Order, SignedOrder } from "@0x/types";
import { BigNumber } from "@0x/utils";
import Web3 from "web3";

export async function sell(provider, sellingPrice, sellingVolume) {
  try {
    const web3Wrapper = new Web3Wrapper(provider);
    const httpClient = new HttpClient("https://api.0x.org");
    const makerAddress = "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5";

    const order = Order({
      chainId: 11155111, // Ethereum Mainnet
      exchangeAddress: "0x4f833a24e1f95d70f028921e27040ca56e09ab0b",
      makerAddress: makerAddress,
      takerAddress: "0x0000000000000000000000000000000000000000",
      feeRecipientAddress: "0x0000000000000000000000000000000000000000",
      senderAddress: "0x0000000000000000000000000000000000000000",
      makerAssetAmount: new BigNumber("1000000000000000000"),
      takerAssetAmount: new BigNumber("200000000000000000000"),
      makerFee: sellingVolume,
      takerFee: sellingPrice,
      expirationTimeSeconds: new BigNumber(Date.now() + 86400000),
      salt: new BigNumber(Date.now()),
      makerAssetData: "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5",
      takerAssetData: "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5",
      makerFeeAssetData: "0x",
      takerFeeAssetData: "0x",
    });

    const signature = await web3Wrapper.signMessageAsync(
      makerAddress,
      Web3.utils.keccak256("Selling at Price Order")
    );

    const signedOrder = SignedOrder({
      ...order,
      signature,
    });

    const response = await httpClient.submitOrderAsync(signedOrder);
  } catch (error) {
    console.log(error);
  }
}
