import axios from "axios";
import fs from "fs";
import { JSDOM } from "jsdom";

const getUserData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    const dom = new JSDOM(response.data);
    const scripts = Array.from(dom.window.document.querySelectorAll("script"));
    const userDataScript = scripts.find(
      (script) => script.id === "__UNIVERSAL_DATA_FOR_REHYDRATION__"
    );
    if (userDataScript) {
      const userData = JSON.parse(userDataScript.textContent || "");
      const profileData =
        userData.__DEFAULT_SCOPE__["webapp.user-detail"].userInfo;
      return profileData;
    } else {
      console.log("User data script not found");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const scrapeArray = async (urls) => {
  const data = {};
  for (const url of urls) {
    const profileData = await getUserData(url);
    if (profileData) {
      data[url] = profileData;
    }
  }
  return data;
};

(async () => {
  const urls = ["https://www.tiktok.com/@therock"];
  const profilesData = await scrapeArray(urls);
  const jsonData = JSON.stringify(profilesData, null, 2);
  fs.writeFileSync("./profilesData.json", jsonData);
  console.log("Data saved to profilesData.json");
})();
