import express from "express";
import verifyToken from "../helpers/verifyToken.js";

var router = express.Router();

//import models
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

//get user by id
router.get("/", verifyToken, async function (req, res) {
  const uid = req.fb_info.uid;

  //payload
  const chatbotName = req.body.chatbotName;
  const role = req.fb_info.role;
  const locationId = req.body.locationId;

  //validate orderId
  if (!chatbotName) {
    return res
      .status(400)
      .json({ status: false, error: "chatbotName is required" });
  }

  if (!locationId) {
    return res
      .status(400)
      .json({ status: false, error: "locationId is required" });
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if user exists
    const user = User.findOne({ uid: uid });

    if (!user) {
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    //query
    let query = Chatbot.findOne({ name: chatbotName, location: locationId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res
      .status(200)
      .json({ status: true, data: { taken: queryResult ? true : false } });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
