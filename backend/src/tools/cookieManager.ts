import fs from "fs";

export const getCookies = () => {
  try {
    return JSON.parse(fs.readFileSync("cookies.json", "utf-8"));
  } catch {
    return null;
  }
};

export const hasCookies = () => {
  const cookies = getCookies();
  return cookies && cookies.length > 0;
};