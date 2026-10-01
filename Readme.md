# Hedging Platform: Backend

A simulation platform that teaches farmers how to trade crops online. Farmers get **ML-based price predictions** (next 7 and 15 days), use them to make trading decisions, and trade with FPOs and buyers. Every deal is recorded on a **blockchain smart contract** as proof of transaction.

> Built for **Smart India Hackathon (SIH) 2025** by a team of [N] members. **National Finalist (Top 5 teams, Grand Finale).**

This repository contains the **Node.js / Express / MongoDB backend** and the **blockchain (Solidity) integration**. The frontend and the ML service live in separate repositories (see below).

---

## Repositories

| Part | Tech | Repository | Owner |
|---|---|---|---|
| **Backend (this repo)** | Node.js, Express.js, MongoDB, Ethers.js | You are here | [Ayush Rajput](https://github.com/ayushrajput545) |
| **Frontend** | Next.js, TypeScript | [FRONTEND_REPO_LINK](https://github.com/Shruti0534/Hedging_frontened) | [Shruti Tiwari](https://github.com/Shruti0534) |
| **ML model + ML backend** | Python, [framework, e.g. FastAPI/Flask] | [ML_REPO_LINK](https://github.com/darshitachaurasia/TS_ml_backend) | [Darshita](https://github.com/darshitachaurasia) |

---

## Problem Statement

Build a simulation platform that teaches farmers how to trade online. The platform should:

1. Predict crop prices for the **next 7 days and 15 days** using a model trained on **NCDEX** and **CREDA** data.
2. Let farmers make trading decisions based on the predicted prices.
3. Let farmers trade through an FPO or buyer, with **blockchain smart contracts** as proof of each transaction.

---

## Features

- **Role-based users:** Farmer, FPO (Farmer Producer Organization), and Buyer
- **Two-level trading flow:**
  - Farmer ↔ FPO, **with price negotiation**
  - FPO ↔ Buyer
- **Price prediction:** 7-day and 15-day crop price forecasts from the ML service
- **Blockchain proof of transaction:** deals are recorded through Solidity smart contracts on an Ethereum test network
- **Simulation mode:** farmers practice trading decisions without real financial risk

---

## System Architecture

```
┌──────────────────┐        ┌──────────────────────┐        ┌──────────────────┐
│  Frontend        │  REST  │  Backend (this repo) │  REST  │  ML Service      │
│  Next.js + TS    │ ─────► │  Node + Express      │ ─────► │  Python          │
│  (separate repo) │        │  MongoDB             │        │  (separate repo) │
└────────┬─────────┘        └──────────┬───────────┘        └──────────────────┘
         │                             │
         │  Ethers.js                  │  Ethers.js
         ▼                             ▼
   ┌─────────────────────────────────────────────┐
   │  Ethereum test network (Solidity contracts) │
   └─────────────────────────────────────────────┘
```

**How a request flows**

1. The user logs in as a Farmer, FPO, or Buyer on the frontend.
2. The frontend calls this backend's REST APIs.
3. For price forecasts, the backend calls the ML service and returns the 7-day and 15-day predictions.
4. When a deal is finalized, the transaction is recorded through the smart contract, and the result is stored in MongoDB.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, TypeScript |
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| Blockchain | Ethereum (test network), Solidity, Ethers.js |
| ML | Python, [add libraries, e.g. pandas, scikit-learn / LSTM] |
| ML Backend | [e.g. FastAPI / Flask] |

---

## My Contribution (Backend)

- Designed **MongoDB schemas** for users (Farmer, FPO, Buyer), crops, trade offers, negotiations, and transactions
- Built **REST APIs** for farmers, FPOs, and buyers, including the negotiation flow
- **Connected the backend APIs with the Next.js frontend**
- Implemented the **blockchain integration** (Solidity smart contracts, deployed on a test network, accessed with Ethers.js)
- Integrated the ML prediction service into the backend

> The ML model and the frontend UI were built by other teammates. See the repository links above.

---

## Project Structure

> Edit this to match your actual folders.

```
hedging-platform-backend/
├── contracts/            # Solidity smart contracts
├── config/               # DB and environment configuration
├── controllers/          # Request handlers (farmer, fpo, buyer, trade)
├── models/               # Mongoose schemas
├── routes/               # Express routes
├── middlewares/          # Auth, role checks, error handling
├── services/             # ML service client, blockchain service
├── utils/
├── .env.example
├── server.js
└── package.json
```

---

## Database Schemas

> Update the fields to match your code.

| Model | Key fields |
|---|---|
| **User** | name, email, password (hashed), role (`farmer` / `fpo` / `buyer`) |
| **Crop / Listing** | crop name, quantity, base price, owner, status |
| **Negotiation** | listing, farmer, FPO, offered price, counter price, status |
| **Trade / Transaction** | seller, buyer, crop, quantity, final price, blockchain tx hash, timestamp |

---

## API Overview

> Replace with your real routes.

| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | All |
| POST | `/api/auth/login` | Log in | All |
| GET | `/api/prices/predict` | Get 7-day and 15-day price prediction | Farmer |
| POST | `/api/listings` | Create a crop listing | Farmer |
| POST | `/api/negotiations` | Start or counter a price negotiation | Farmer, FPO |
| POST | `/api/trades` | Finalize a trade and record it on chain | FPO, Buyer |
| GET | `/api/trades/:id` | Get trade details and tx hash | All |

---

## Blockchain Integration

- **Platform:** Ethereum (deployed on a **test network**, no real funds involved)
- **Smart contracts:** written in **Solidity**
- **Interaction:** **Ethers.js** is used to call the contracts from the backend and the Next.js frontend
- **Purpose:** each finalized trade is recorded on chain as a tamper-proof record of the transaction

Contract address: `[ADD_CONTRACT_ADDRESS]`
Network: `[e.g. Sepolia]`

---

## ML Service

The price prediction model is maintained in a **separate repository**: [ML_REPO_LINK](ML_REPO_LINK)

- Predicts crop prices for the **next 7 and 15 days**
- Trained on **NCDEX** and **CREDA** data
- Exposed through its own Python backend, which this backend calls
- Model details: [add model type, input features, accuracy once confirmed by the ML teammate]

Set the ML service URL in `.env` as `ML_SERVICE_URL`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- A wallet and an RPC URL for the Ethereum test network
- The ML service running (see the ML repository)

### Installation

```bash
git clone https://github.com/ayushrajput545/<REPO_NAME>.git
cd <REPO_NAME>
npm install
```

### Environment variables

Create a `.env` file from `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
BLOCKCHAIN_RPC_URL=your_testnet_rpc_url
PRIVATE_KEY=your_test_wallet_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

> Never commit `.env` or a real private key. Use a test wallet only.

### Run

```bash
npm run dev     # development
npm start       # production
```

### Run the full platform

1. Start this backend.
2. Start the ML service ([ML repo](ML_REPO_LINK)).
3. Start the frontend ([frontend repo](FRONTEND_REPO_LINK)) and point it to this backend's URL.

---

## Team and Workflow

We worked as a team of [N] through four stages:

1. **Planning:** analysed the problem statement, divided work across frontend, backend, ML, and blockchain, and agreed on API contracts.
2. **Implementation:** built each part in a separate repository and integrated them through REST APIs.
3. **Testing and integration:** connected frontend, backend, ML service, and smart contracts end to end.
4. **Presenting:** demoed the working platform at the SIH Grand Finale.

| Member | Role |
|---|---|
| Ayush Rajput | Backend, APIs, database, blockchain integration, frontend-backend integration |
| [Name] | Frontend |
| [Name] | ML model and ML backend |
| [Name] | [Role] |

---

## Achievement

**Smart India Hackathon 2025: National Finalist (Top 5 teams in the Grand Finale)**

---

## Future Improvements

- Deploy contracts to a public testnet or mainnet after an audit
- Add real-time notifications for negotiation updates
- Add more crops and regional price data
- Improve the model with more recent market data

---

## Contact

**Ayush Rajput**
GitHub: [github.com/ayushrajput545](https://github.com/ayushrajput545)
LinkedIn: [linkedin.com/in/ayush-rajput-199574287](https://www.linkedin.com/in/ayush-rajput-199574287/)
