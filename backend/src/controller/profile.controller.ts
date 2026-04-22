import type { Request, Response } from "express";
import { profileAgent } from "../agents/profileAgent.js";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        error: "input (LinkedIn URL or name) required",
      });
    }

    const result = await profileAgent(input);

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message,
    });
  }
};