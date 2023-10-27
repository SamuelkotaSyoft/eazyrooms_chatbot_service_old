import express from "express";
import { uploadImageToS3 } from "../helpers/uploads/uploadImageToS3.js";
import verifyToken from "../helpers/verifyToken.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//create chatbot
router.post("/", verifyToken, uploadImageToS3, async function (req, res) {
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;

  const imageUrl = req.fileUrl; // file url from S3 (middleware)
  const fileType = req.fileType;
  // console.log("IMG URL...", imageUrl);

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
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

    console.log(imageUrl);
    // add upload
    const upload = new File({
      user: user._id,
      name: imageUrl?.split("/").pop(),
      url: imageUrl,
      fileType: fileType,
    });

    //save address
    const writeResult = await upload.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
