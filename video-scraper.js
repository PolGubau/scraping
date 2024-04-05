import axios from "axios";
import fs from "fs";
import { JSDOM } from "jsdom";

const getVideoInfo = async (videoId) => {
  try {
    const response = await axios.get(
      `https://www.tiktokv.com/share/video/${videoId}/`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
        },
      }
    );
    const dom = new JSDOM(response.data);
    const scripts = Array.from(dom.window.document.querySelectorAll("script"));
    const userDataScript = scripts.find(
      (script) => script.id === "__UNIVERSAL_DATA_FOR_REHYDRATION__"
    );
    if (userDataScript) {
      const userData = JSON.parse(userDataScript.textContent || "");
      const profileData = userData.__DEFAULT_SCOPE__["webapp.video-detail"];
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

(async () => {
  const videoId = "7354404472258301227";
  const videoInfo = await getVideoInfo(videoId);
  if (videoInfo) {
    const jsonData = JSON.stringify(videoInfo, null, 2);
    fs.writeFileSync(`./video_${videoId}_info.json`, jsonData);
    console.log(`Video info saved to video_${videoId}_info.json`);
  } else {
    console.log("Failed to fetch video info.");
  }
})();
