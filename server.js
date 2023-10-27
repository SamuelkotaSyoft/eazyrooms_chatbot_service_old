import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use("/createChatbot", (await import("./routes/createChatbot.js")).default);

app.use(
  "/getAllChatbots",
  (await import("./routes/getAllChatbots.js")).default
);

app.use(
  "/getChatbotById",
  (await import("./routes/getChatbotById.js")).default
);

app.use(
  "/updateChatbotById",
  (await import("./routes/updateChatbotById.js")).default
);

app.use(
  "/deleteChatbotById",
  (await import("./routes/deleteChatbotById.js")).default
);

app.use(
  "/checkChatbotName",
  (await import("./routes/checkChatbotName.js")).default
);

app.use(
  "/updateChatbotActiveStatus",
  (await import("./routes/updateChatbotActiveStatus.js")).default
);

app.use(
  "/uploadNodeImage",
  (await import("./routes/uploadNodeImage.js")).default
);

app.use(
  "/uploadNodeVideo",
  (await import("./routes/uploadNodeVideo.js")).default
);

app.use(
  "/uploadNodeDocument",
  (await import("./routes/uploadNodeDocument.js")).default
);

app.use(
  "/uploadNodeAudio",
  (await import("./routes/uploadNodeAudio.js")).default
);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`Chatbot service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Chatbot Service" });
});
