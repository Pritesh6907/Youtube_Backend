import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { registerUser} from "../controller/user.controller.js";
import {loginUser} from '../controller/user.controller.js'
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);
router.route("/login").post(loginUser);
export default router;
