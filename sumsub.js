import fetch from "node-fetch";

const SUMSUB_SECRET_KEY = "YOUR_SUMSUB_SECRET_KEY"; // Example: Hej2ch71kG2kTd1iIUDZFNsO5C1lh5Gq - Please don't forget to change when switching to production

const getAccessToken = async () => {
  const url =
    "https://api.sumsub.com/resources/accessTokens?userId=1&levelName=basic-kyc-level&ttlInSecs=600";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-App-Token":
          "sbx:H8nh5J3wu9I1WkER6CdyLrGQ.2noxvgddbS3ipB4AJDkJCBgCcdGgQ89l",
      },
      "Content-Type": "application/json",
    });
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error("error:" + error);
  }
};

getAccessToken();
