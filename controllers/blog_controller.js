import mongoose from "mongoose";

import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs=async(req,res,next)=>{
     let blogs;
     try{
          blogs=await Blog.find().populate("user");
     }catch(err){
          console.log(err);
     }
     if(!blogs){
          return res.status(404).json({message:"No Blogs Found"});
     }
     return res.status(200).json({blogs});
}

export const addBlogs=async(req,res,next)=>{
     const {title,description,image,user}=req.body;

     let existingUser;
     try{
          existingUser= await User.findById(user);
     }catch(e){
          console.log(e);
     }
     if(!existingUser){
          return res.status(404).json({message:"User not found"});
     }
     const createdBlog=new Blog({
          title,
          description,
          image,
          user
     });
     try{
          const session = await mongoose.startSession();
          session.startTransaction();
          await createdBlog.save({session:session});
          existingUser.blogs.push(createdBlog);
          await existingUser.save({session:session});
          await session.commitTransaction();
     }catch(err){
          console.log(err);
     }
     return res.status(201).json({blog:createdBlog});
}

export const UpdateBlog=async(req,res,next)=>{
     const {title,description,image}=req.body;
     const blogId= req.params.id;
     let blog;
     try{
          blog= await Blog.findByIdAndUpdate(blogId,{
               title,
               description,
               image
          });
     }catch(err){
          return console.log(err);
     }

     if(!blog){
          return res.status(404).json({message:"Blog Not Found"});
     }
     return res.status(200).json({blog});
}

export const getById=async(req,res,next)=>{
     const blogId= req.params.id;

     let blog;
     try{
          blog= await Blog.findById(blogId);
     }catch(err){
          return console.log(err);
     }

     if(!blog){
          return res.status(404).json({message:"Blog Not Found"});
     }
     return res.status(200).json({blog});
}

export const deleteBlog=async(req,res,next)=>{
     const blogId= req.params.id;
     let blog;
     try{
          blog= await Blog.findByIdAndDelete(blogId).populate("user");
          await blog.user.blogs.pull(blog);
          await blog.user.save();
     }catch(err){
          return console.log(err);
     }
     if(!blog){
          return res.status(404).json({message:"Blog Not Found"});
     }
     return res.status(200).json({message:"Blog Deleted"});
}

export const getBlogsByUser=async(req,res,next)=>{
     const userId= req.params.id;
     let userblogs;
     try{
          userblogs= await User.findById(userId).populate("blogs");
     }catch(err){
          return console.log(err);
     }
     if(!userblogs){
          return res.status(404).json({message:"No Blogs Found"});
     }
     return res.status(200).json({blogs:userblogs});
}