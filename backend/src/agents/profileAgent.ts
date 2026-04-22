import { runProfilePipeline } from "../pipeline/pipeline.js";

export const profileAgent = async (input: string) => {
  return await runProfilePipeline(input);
};