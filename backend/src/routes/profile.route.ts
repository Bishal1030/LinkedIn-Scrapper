import { Router } from "express";
import { getProfile } from "../controller/profile.controller.js"; 

const router = Router();

router.post("/", getProfile);

export default router;