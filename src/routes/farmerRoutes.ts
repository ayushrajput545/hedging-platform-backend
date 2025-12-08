import { Router } from "express";
import { auth } from "../middleware/Auth";
import { getFarmerProfile } from "../controllers/farmer";
 

const router: Router = Router();

router.get('/get-farmer-info',auth,getFarmerProfile)


 
 

export default router;
