import express from 'express'
const router=express.Router();
import { generateImage } from "../controllers/aiController.js";

  router.post('/',generateImage);
  
export default router;