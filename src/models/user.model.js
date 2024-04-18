import { Schema, mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "json-web-token";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Require!!"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is Require!!"],
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "username is Require!!"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // data form Cloudinary
      required: [true, "Avatar is Require!!"],
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is Require"],
    },
    watchHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
    );
  };
  userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      },
    );
  };
});

export const User = mongoose.model("User", userSchema);
