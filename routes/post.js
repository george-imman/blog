const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('./../models/blog');
const authenticateToken = require('../middleware');
const { default: mongoose } = require('mongoose');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      author: req.user.id
    });
    await post.save()
    .then((data)=>{
        res.status(201).json({"message":"Blog saved successfully", data: data.id});
    })
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json({"userBlogPosts": posts});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    res.json(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    let reqBody = {
    }
    if(title){
        Object.assign(reqBody, {"title":title})
    }
    if(content){
        Object.assign(reqBody, {"content":content})
    }
    if(req.file){
        Object.assign(reqBody, {"imageUrl":`/uploads/${req.file.filename}`})
    }
    post.imageUrl = req.file ? `/uploads/${req.file.filename}` : '',
    await Post.updateOne({_id:req.params.id},reqBody);
    res.status(200).send({"success": "Blog updated successfully"});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
    res.status(400).send({"errorMessage": "Blog not found"});
    }
    if (post.author.toString() !== req.user.id) return res.status(403).send('Unauthorized');

    await Post.deleteOne({_id:req.params.id});
    res.status(200).send({"success": "Blog deleted"});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
