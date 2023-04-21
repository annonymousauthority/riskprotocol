import { useEffect, useState } from "react";
import abi from "@/pages/utils/riskprotocol.json";
import { ethers } from "ethers";
import { sell } from "./utils/tradeActions";
import { SupportedProvider } from "@0x/web3-wrapper";
import Web3 from "web3";
import { BigNumber } from "@0x/utils";

export default function Home() {
  const contractAddress = "0x3B9d38D7fd411866212e0773CEdB1C82abE1739D";
  const contractABI = abi.abi;

  const [status, setStatus] = useState("Connect to MetaMask");
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);
  const [option, setOption] = useState(0);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellAmount, setSellAmount] = useState("");

  const connect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const tokenContract = new web3.eth.Contract(
          contractABI,
          contractAddress
        );
        tokenContract.methods
          .name()
          .call()
          .then((name) => {});

        let userAddress;
        web3.eth.getAccounts().then((accounts) => {
          userAddress = accounts[0];
          setAddress(userAddress);
          tokenContract.methods
            .balanceOf(userAddress)
            .call()
            .then((_balance) => {
              setBalance(`${ethers.formatEther(_balance)}`);
            });
        });
        setIsMetaMaskConnected(true);
        setStatus("Connected");
      } catch (err) {
        console.error(err);
        setStatus("Connect to MetaMask");
      }
    }
  };

  const handleSellPriceChange = (event) => {
    setSellPrice(event.target.value);
  };

  const handleSellAmountChange = (event) => {
    setSellAmount(event.target.value);
  };
  const sellToken = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await sell(provider, new BigNumber(sellPrice), new BigNumber(sellAmount));
  };
  const buyToken = () => {};
  const rebase = () => {
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(contractABI, contractAddress);
    tokenContract.methods
      .rebase(1, 5)
      .send({ from: "0x58EA67b7FaB72D91ffF367B73452318877Cf57e5" })
      .on("receipt", (receipt) => {
        console.log("Transaction confirmed:", receipt.transactionHash);
      })
      .on("error", (error) => {
        console.error("Error occurred:", error);
      });
  };

  useEffect(() => {}, []);
  return (
    <main className="flex flex-col items-center justify-between p-24 space-y-32">
      <div className="flex justify-between w-full lg:max-w-6xl mx-auto flex-col lg:flex-row space-y-6 lg:space-y-0">
        <h1 className="inline-block text-xl lg:text-3xl text-transparent bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-center ">
          RiskProtocol UI
        </h1>
        <button
          onClick={connect}
          className="p-3 w-full lg:w-1/4 bg-gradient-to-r from-blue-500 to-blue-800 cursor-pointer text-white"
        >
          {status}
        </button>
      </div>

      <div className="flex flex-col items-start justify-start space-y-12 w-full lg:max-w-6xl mx-auto">
        <div className="flex space-x-6 flex-col lg:flex-row space-y-2 lg:space-y-0 mx-auto w-1/2">
          <button
            onClick={() => {
              setOption(0);
            }}
            className={
              option == 0
                ? `bg-black text-white p-3 w-1/3 text-base lg:text-3xl`
                : `text-black font-bold text-base lg:text-3xl w-1/3`
            }
          >
            Sell
          </button>
          <button
            onClick={() => {
              setOption(1);
            }}
            className={
              option == 1
                ? `bg-black text-white p-3 w-1/3 text-base lg:text-3xl`
                : `text-black font-bold text-base lg:text-3xl w-1/3`
            }
          >
            Buy
          </button>
          <button
            onClick={() => {
              setOption(2);
            }}
            className={
              option == 2
                ? `bg-black text-white p-3 w-1/3 text-base lg:text-3xl`
                : `text-black font-bold text-base lg:text-3xl w-1/3`
            }
          >
            Rebase
          </button>
        </div>
        {option == 0 ? (
          <div className="flex flex-col w-full lg:max-w-6xl mx-auto space-y-6">
            <span className="w-full lg:w-1/2 mx-auto ">Address: {address}</span>
            <span className="w-full lg:w-1/2 mx-auto text-black">
              Balance: {balance}
            </span>
            <div className="w-1/2 mx-auto">
              <label>Amount To Sell</label>
              <input
                value={sellAmount}
                onChange={handleSellAmountChange}
                type="number"
                className="w-full border-[1px] border-gray-300 p-3 rounded-xl mx-auto"
              />
            </div>
            <div className="w-1/2 mx-auto">
              <label>Price</label>
              <input
                value={sellPrice}
                onChange={handleSellPriceChange}
                type="number"
                className="w-full border-[1px] border-gray-300 p-3 rounded-xl mx-auto"
              />
            </div>
            <button
              onClick={() => {
                sellToken();
              }}
              className="bg-black text-white p-3 w-full lg:w-1/5 text-base lg:text-3xl mx-auto rounded-2xl"
            >
              Sell Token
            </button>
          </div>
        ) : option == 1 ? (
          <div className="flex flex-col w-full lg:max-w-6xl mx-auto space-y-6">
            <span className="w-full lg:w-1/2 mx-auto ">Address: {address}</span>
            <span className="w-full lg:w-1/2 mx-auto text-black">
              Balance: {balance}
            </span>
            <input
              type="number"
              className="w-1/2 border-[1px] border-gray-300 p-3 rounded-xl mx-auto"
            />
            {/* <input type="text" className='w-1/2 border-[1px] border-gray-300 p-3 rounded-xl mx-auto'/> */}
            <button
              onClick={() => {
                buyToken();
              }}
              className="bg-black text-white p-3 w-full lg:w-1/5 text-base lg:text-3xl mx-auto rounded-2xl"
            >
              Buy Token
            </button>
          </div>
        ) : (
          <div className="flex flex-col w-full lg:max-w-6xl mx-auto space-y-6">
            <span className="w-full lg:w-1/2 mx-auto ">Address: {address}</span>
            <span className="w-full lg:w-1/2 mx-auto text-black">
              Balance: {balance}
            </span>
            <button
              onClick={() => {
                rebase();
              }}
              className="bg-black text-white p-3 w-full lg:w-1/5 text-base lg:text-3xl mx-auto rounded-2xl"
            >
              Rebase
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
