import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

const router = express.Router();

router.delete("/:chatbotId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //request payload
  const chatbotId = req.params.chatbotId;
  const role = req.user_info.role;

  //validate chatbotId
  if (!chatbotId) {
    res.status(400).json({ status: false, error: "chatbotId is required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if user exists
    const user = await User.findOne({ uid: uid });
    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    //check if chatbot exists
    const chatbot = Chatbot.findById(chatbotId);
    if (!chatbot) {
      res.status(400).json({ status: false, error: "Invalid chatbot" });
      return;
    }

    //delete chatbot
    const writeResult = await Chatbot.deleteOne({ _id: chatbotId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
