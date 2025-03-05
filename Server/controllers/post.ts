import Post, {postType,} from '../models/post';
import FeaturedPost from '../models/featuredPost';
import cloudinary from '../cloud';
import mongoose, {isValidObjectId} from "mongoose";
import {RequestHandler} from "express";
import {ObjectId} from 'bson';

const {uploader} = cloudinary;


//Helper Functions
const addToFeatured = async (_id: ObjectId) => {
    const FEATURED_POST_LIMIT = 5;
    const AlreadyExists = await FeaturedPost.findOne({post: _id});
    if (AlreadyExists) {
        return;
    }
    const featuredPost = new FeaturedPost({
        post: _id
    });
    await featuredPost.save();
    const featuredPosts = await FeaturedPost.find({}).sort({timeStamp: -1});

    for (let index = 0; index < featuredPosts.length; index++) {
        const post = featuredPosts[index];
        if (index >= FEATURED_POST_LIMIT) {
            await FeaturedPost.findByIdAndDelete(post._id);
        }
    }
}

async function removeFeatured(_id: ObjectId) {
    await FeaturedPost.findOneAndDelete({post: _id});

}

async function isFeatured(postId: ObjectId) {
    const post = await FeaturedPost.findOne({post: postId});
    return !!post;
}

//controllers
export const createPost: RequestHandler = async (req, res) => {
    try {
        const {title, content, thumbnail, meta, slug, author, timeStamp, tags, featured} = req.body;
        const postExists = await Post.findOne({slug});
        if (postExists) {
            res.status(400).json({error: 'Post with this slug already exists, Use unique slug'});
            return;
        }
        const post = new Post({
            title, content, thumbnail, meta, slug, author, timeStamp, tags
        });

        const {file} = req;
        if (file) {
            const {secure_url, public_id} = await uploader.upload(file.path)
            post.thumbnail = {url: secure_url, public_id: public_id};
        }
        await post.save();

        if (featured) {
            await addToFeatured(post._id);
        }
        res.status(200).json({
            id: post._id,
            title,
            content,
            thumbnail: post.thumbnail?.url,
            author,
            timeStamp,
            tags,
            slug
        });

    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({error: error});
        return;
    }
}

export const uploadImage: RequestHandler = async (req, res) => {
    try {
        const {file} = req;
        if (!file) {
            res.status(401).json({error: 'No file found'});
            return;
        }
        const {secure_url, public_id} = await uploader.upload(file.path)
        res.status(201).json({image: secure_url, id: public_id});
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({error: error});
        return;
    }
}

export const deletePost: RequestHandler = async (req, res) => {
    const {postId} = req.params;

    if (!isValidObjectId(postId)) {
        res.status(401).json({error: 'Invalid request'});
        return;
    }
    const PId = new mongoose.Types.ObjectId(postId);
    const post = await Post.findById(PId);
    if (!post) {
        res.status(404).json({error: 'No Post Found!'});
        return;
    }
    const public_id = post.thumbnail?.public_id;
    console.log(public_id);
    if (public_id) {
        const {result} = await uploader.destroy(String(public_id));
        if (result === 'not found') {
            await Post.findByIdAndDelete(postId);
            res.json({message: 'Post Deleted Successfully'});
            return;
        }
        if (result !== 'ok') {
            console.log(result);
            res.status(401).json({error: result});
            return;
        }

    }
    await Post.findByIdAndDelete(postId);
    await removeFeatured(PId);
    res.status(200).json({message: 'Post Deleted Successfully'});
}

export const updatePost: RequestHandler = async (req, res) => {
    try {
        const {postId} = req.params;
        if (!isValidObjectId(postId)) {
            res.status(401).json({error: 'Invalid request'});
            return;
        }
        const PId = new mongoose.Types.ObjectId(postId);
        const post = await Post.findById(PId);

        if (!post) {
            res.status(404).json({error: 'No Post Found!'});
            return;
        }
        console.log('post exists')
        const {title, content, meta, slug, author, timeStamp, tags, featured} = req.body;
        post.title = title;
        post.content = content;
        post.meta = meta;
        post.slug = slug;
        post.author = author;
        post.timeStamp = timeStamp;
        post.tags = tags;


        const thumbnail_id = post.thumbnail?.public_id;
        const {file} = req;

        if (file) {
            const {secure_url, public_id} = await uploader.upload(file.path);
            post.thumbnail = {url: secure_url, public_id: public_id};
            if (thumbnail_id) {
                const {result} = await uploader.destroy(String(thumbnail_id));
                if (result !== 'ok') {
                    res.status(401).json({error: result});
                    return
                }
            }
        } else {
            const {result} = await uploader.destroy(String(thumbnail_id));
            if (result !== 'ok') {
                res.status(401).json({error: result});
                return;
            }
        }

        if (featured) {
            await addToFeatured(post._id);
        } else {
            await removeFeatured(post._id);
        }

        await post.save();
        res.json({id: post._id, title, content, thumbnail: post.thumbnail?.url, author, timeStamp, tags, slug});
    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({error: error});
        return;
    }
}

export const getPost: RequestHandler = async (req, res) => {
    const {slug} = req.params;
    if (!slug) {
        res.status(401).json({error: 'Invalid request'});
        return;
    }
    const post = await Post.findOne({slug});
    if (!post) {
        res.status(404).json({error: 'No post found'})
        return;
    }
    const Featured = await isFeatured(post._id);
    const {_id, title, content, thumbnail, meta, author, timeStamp, tags} = post;
    res.status(200).json({
        post: {
            id: _id,
            title,
            content,
            thumbnail: thumbnail?.url,
            slug,
            tags,
            meta,
            author,
            createdAt: timeStamp,
            Featured: Featured
        }
    })
}

export const getPosts: RequestHandler = async (req, res) => {
    const {pageNo = 0, limit = 5} = req.query;
    const posts = await Post.find().sort({createdAt: -1}).skip(Number(pageNo) * Number(limit)).limit(Number(limit));
    if (!posts) {
        res.status(404).json({error: 'No post found'})
        return
    }
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / Number(limit));
    res.status(200).json({
        posts: posts.map(({_id, title, content, thumbnail, tags, author, meta, slug, timeStamp}) => ({
            id: _id,
            title,
            content,
            thumbnail: thumbnail?.url,
            tags,
            slug,
            meta,
            author,
            timeStamp
        })),
        pagination: {
            totalPosts,
            totalPages,
            currentPage: pageNo,
            postsPerPage: limit,
        },
    });
}

export const getSimilarPosts: RequestHandler = async (req, res) => {
    const {postId} = req.params;
    if (!isValidObjectId(postId)) {
        res.status(401).json({error: 'Invalid request'});
        return;
    }
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404).json({error: 'No post found'});
        return;
    }
    const posts = await Post.find({
        tags: {$in: [...post.tags]},
        _id: {$ne: postId}
    }).sort({createdAt: -1}).limit(5);
    if (!posts) {
        res.status(404).json({error: 'No post found'});
        return;
    }
    res.status(200).json({
        posts: posts.map(({_id, title, content, thumbnail, tags, author, timeStamp}) => ({
            id: _id,
            title,
            content,
            thumbnail: thumbnail?.url,
            tags,
            author,
            timeStamp,
        }))
    });
}

export const getFeaturedPosts: RequestHandler = async (req, res) => {

    const featuredPosts = await FeaturedPost.find().sort({createdAt: -1}).populate<{ post: postType }>('post');
    if (!featuredPosts) {
        res.status(404).json({error: 'No post found'})
        return;
    }
    res.status(200).json({
        posts: featuredPosts.map(({post}) => ({
            id: post._id,
            title: post.title,
            content: post.content,
            thumbnail: post.thumbnail?.url,
            tags: post.tags,
            author: post.author,
            createdAt: post.timeStamp,

        }))
    });
}

export const searchPosts: RequestHandler = async (req, res) => {
    try {
        const query = req.query.query || req.query.title || ""; // Handle both query and title

        console.log("Received Query:", query); // Debugging log

        if (typeof query !== "string" || !query.trim()) {
            console.log("Invalid Query:", query);
            res.status(400).json({error: "Invalid Search Query"});
            return;
        }

        const posts = await Post.find({title: {$regex: query, $options: "i"}});
        if (!posts.length) {
            res.status(404).json({error: "No post found"});
            return;
        }

        res.status(200).json({
            posts: posts.map(({_id, title, content, thumbnail, tags, author, meta, slug, timeStamp}) => ({
                id: _id,
                title,
                content,
                thumbnail: thumbnail?.url,
                tags,
                slug,
                meta,
                author,
                createdAt: timeStamp,
            })),
        });
        return

    } catch (error: unknown) {
        console.error(error);
        res.status(500).json({error: error});
        return;
    }
}


// export {createPost,uploadImage,deletePost,searchPosts,updatePost, getPost,getPosts, getFeaturedPosts,getSimilarPosts}
