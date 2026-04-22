import { Router } from "express";
import { getProfile } from "../controller/profile.controller.js"; 
import { hasCookies } from "../tools/cookieManager.js";
import { runLoginFlow } from "../script/loginScript.js";

const router = Router();

router.post("/", getProfile);

// Check if cookies exist before scraping
router.get("/cookie-status", (_req, res) => {
  res.json({ hasCookies: hasCookies() });
});

// Trigger the login flow (opens browser on server machine)
router.post("/login", async (_req, res) => {
  try {
    await runLoginFlow();
    res.json({ success: true, message: "Login complete, cookies saved." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;