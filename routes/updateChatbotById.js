import express from "express";
import { uploadImageToS3 } from "../helpers/uploads/uploadImageToS3.js";
import verifyToken from "../helpers/verifyToken.js";
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//new buyer
router.patch("/", verifyToken, uploadImageToS3, async function (req, res) {
  console.log(req.body);
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;
  const chatbotId = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const nodes = JSON.parse(req.body.nodes);
  const edges = JSON.parse(req.body.edges);
  const imageUrl = req.fileUrl; // file url from S3 (middleware)
  // console.log(req.fileUrl);

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
    return;
  }

  //validate quantity
  if (!chatbotId) {
    res.status(400).json({ status: false, error: "addressId is required" });
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

    //update user
    const writeResult = await Chatbot.updateOne(
      { _id: chatbotId },
      {
        $set: {
          name: name,
          description: description,
          nodes: nodes,
          edges: edges,
          image: imageUrl,
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

export default router;
