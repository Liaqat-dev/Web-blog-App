 import express from 'express';
const multer = require('../middleware/multer').default;

import {
    createPost,
    deletePost,
    updatePost,
    getPost,
    getPosts,
    searchPosts,
    getFeaturedPosts,
    getSimilarPosts,
    uploadImage
} from "../controllers/post";
import {postValidator, validate, parseData} from "../middleware/postValidator";

const router = express.Router();


router.post('/create', multer.single('thumbnail'), parseData, postValidator, validate, createPost);
router.post('/upload-image', multer.single('image'),uploadImage);
router.put('/:postId', multer.single('thumbnail'), parseData, postValidator, validate, updatePost);
router.delete('/:postId', deletePost);
router.get('/single/:slug', getPost);
router.get('/featured', getFeaturedPosts);
router.get('/posts', getPosts);
router.get('/similar-posts/:postId', getSimilarPosts);
router.get('/search', searchPosts);

export default router;