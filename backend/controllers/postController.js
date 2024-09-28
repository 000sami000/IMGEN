import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import postModel from "../models/posts.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const getPost = async (req, res) => {
  try {
    const posts = await postModel.find({});
    // console.log("??",posts)
   return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};
const createPost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    console.log("----",req.body)
    const photoUrl = await cloudinary.uploader.upload(photo);
console.log(photoUrl,";;;;")
    const newPost = await postModel.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};
export { getPost, createPost };
