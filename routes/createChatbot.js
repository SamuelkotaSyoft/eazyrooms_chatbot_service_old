import express from "express";
import { uploadImageToS3 } from "../helpers/uploads/uploadImageToS3.js";
import verifyToken from "../helpers/verifyToken.js";
import Chatbot from "../models/chatbotModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//create chatbot
router.post("/", verifyToken, uploadImageToS3, async function (req, res) {
  console.log({ reqbody: req.body });
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;
  const name = req.body.name;
  const description = req.body.description;
  const nodes = JSON.parse(req.body.nodes);
  const edges = JSON.parse(req.body.edges);
  const imageUrl = req.fileUrl; // file url from S3 (middleware)
  const locationId = req.body.locationId;

  const role = req.user_info.role;

  console.log({ role });

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
    return;
  }

  //validate name
  if (!name) {
    res.status(400).json({ status: false, error: "name is required" });
    return;
  }

  //validate nodes
  if (!nodes) {
    res.status(400).json({ status: false, error: "nodes is required" });
    return;
  }

  //validate edges
  if (!edges) {
    res.status(400).json({ status: false, error: "edges is required" });
    return;
  }

  if (!locationId) {
    res.status(400).json({ status: false, error: "locationId is required" });
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
      // console.log("NO USER");
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //add address
    const chatbot = new Chatbot({
      property: user.property,
      location: locationId,
      name: name,
      description: description,
      nodes: nodes,
      edges: edges,
      image: imageUrl,
    });

    //save address
    const writeResult = await chatbot.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

export default router;
