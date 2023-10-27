import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//get user by id
router.get("/:chatbotId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //payload
  const chatbotId = req.params.chatbotId;
  const role = req.user_info.role;

  //validate orderId
  if (!chatbotId) {
    return res
      .status(200)
      .json({ status: false, error: "chatbotId is required" });
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
    //query
    let query = Chatbot.findOne({ _id: chatbotId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
