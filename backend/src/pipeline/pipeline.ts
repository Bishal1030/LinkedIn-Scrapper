import { scrapeLinkedIn } from "../tools/scrapeTool.js";
import { extractProfileWithAI } from "../tools/aiExtractor.js";

export type PipelineState = {
  rawProfile?: any;
  extractedProfile?: any;
  error?: string;
};

export const runProfilePipeline = async (
  input: string
): Promise<PipelineState> => {
  try {
    if (!input.includes("linkedin.com")) {
      return { error: "Only LinkedIn URLs supported in this mode" };
    }

    const raw = await scrapeLinkedIn(input);

    const isLoggedOut =
      raw.text?.includes("Sign in") ||
      raw.text?.includes("Join LinkedIn") ||
      raw.text?.length < 200;

    if (isLoggedOut) {
      return {
        error: "LinkedIn session expired or login required",
        rawProfile: raw,
      };
    }

    const extracted = await extractProfileWithAI(raw.text);

    return {
      rawProfile: raw,
      extractedProfile: extracted,
    };
  } catch (e: unknown) {
    return {
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
};