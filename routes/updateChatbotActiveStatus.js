import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//new buyer
router.patch("/", verifyToken, async function (req, res) {
  console.log(req.body);
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;
  const chatbotId = req.body.chatbotId;
  const active = req.body.active;
  const locationId = req.body.locationId;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
    return;
  }

  //validate quantity
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
      res.status(400).json({ status: false, error: "Invalid uid" });
      return;
    }

    //check if chatbot exists
    const chatbot = await Chatbot.findById(chatbotId);
    if (!chatbot) {
      res.status(400).json({ status: false, error: "Invalid chatbot" });
    }

    //disable all other chatbots if a chatbot is being activated
    if (active == true) {
      const disableResult = await Chatbot.updateMany(
        { location: locationId },
        {
          $set: {
            active: false,
          },
        },
        { new: true }
      );
    }

    //update chatbot
    const writeResult = await Chatbot.findOneAndUpdate(
      { _id: chatbotId },
      {
        $set: {
          active: active,
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
