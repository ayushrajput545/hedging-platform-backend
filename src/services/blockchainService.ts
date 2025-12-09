import { ethers } from "ethers";
const abi = require("../abi.json");
import { BlockChianCONFIG } from "../config/blockchainConfig";
 

const provider = new ethers.JsonRpcProvider(BlockChianCONFIG.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export const contract: any = new ethers.Contract(
  BlockChianCONFIG.CONTRACT_ADDRESS,
  abi,
  wallet
);
