import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import { uploadDocumentToS3 } from "../helpers/uploads/uploadDocumentToS3.js";

var router = express.Router();

//create chatbot
router.post("/", verifyToken, uploadDocumentToS3, async function (req, res) {
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;
  const name = req.body.name;

  const documentUrl = req.fileUrl; // file url from S3 (middleware)
  const fileType = req.fileType;
  // console.log("IMG URL...", documentUrl);

  const role = req.user_info.role;

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

    // add upload
    const upload = new File({
      user: user._id,
      name: name,
      url: documentUrl,
      fileType: fileType,
    });

    //save address
    const writeResult = await upload.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

export default router;
