import "dotenv/config";
import { profileAgent } from "../agents/profileAgent.js";

const run = async () => {
  console.log("\n==============================");
  console.log("🔗 TEST: LINKEDIN PROFILE SCRAPER");
  console.log("==============================");

  const url = "https://www.linkedin.com/in/aaryash-kc-73440525b/";

  const res = await profileAgent(url);

  console.log("\n📦 FINAL OUTPUT:\n");
  console.dir(res, { depth: null });
};

run();