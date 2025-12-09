import dotenv from 'dotenv';

dotenv.config();

export const BlockChianCONFIG = {
    PORT: process.env.PORT || 3000,
    RPC_URL: process.env.RPC_URL, // Default public RPC
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '0xeE60291E93dA9A242312237BF876052609ee11DE',
};
