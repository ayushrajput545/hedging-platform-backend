import express from "express";
import { auth } from "../middleware/Auth";
import { closeHedge, createHedge, getHedges } from "../controllers/hedge";
 

const router = express.Router();

router.post("/create-hedge", auth, createHedge);
router.get("/get-hedges", auth, getHedges);
router.put("/close-hedge/:id", auth, closeHedge);

export default router;
