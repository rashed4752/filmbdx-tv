import https from "https";

https.get("https://streamhub-fb5cf-default-rtdb.asia-southeast1.firebasedatabase.app/.json", (res) => {
  let data = "";
  res.on("data", (c) => data += c);
  res.on("end", () => console.log(data));
});
