import client from "./client.ts";

async function getPosts(pageNo: number, limit: number) {
    try {
        const {data} = await client.get(`/posts?pageNo=${pageNo}&limit=${limit}`);
        return data;

    } catch (e) {
        return {error: e}
    }
}

async function deletePost(postId: string) {
    try {
        const message = await client.delete(`/${postId}`);
        return message;

    } catch (e) {
        return {error: e}
    }
}

async function searchPost(query: string) {
    try {
        const response = await client.get(`/search?title=${query}`);
        console.log(response);
        return response.data;


    } catch (e) {
        return {error: e}
    }
}

async function getPost(slug: string) {
    try {
        const {data} = await client.get(`/single/${slug}`);
        return data;
    } catch (e) {
        return {error: e}
    }
}

async function uploadImage(formData: FormData) {
    try {
        const response = await client.post(`/upload-image`, formData);
        console.log(response);
        return {response: response};


    } catch (e) {
        return {error: e}
    }
}

async function createPost(formData: FormData) {
    try {
        const {data} = await client.post(`/create`, formData);
        console.log(data);
        return {post: data };
    } catch (e) {
        return {error: e}
    }
}
async function updatePost(id: string,formData:FormData) {
    try {
        const {data} = await client.put(`/${id}`,formData);
        console.log(data);
        return {post: data };
    } catch (e) {
        return {error: e}
    }
}

export {createPost,updatePost, getPosts, deletePost, searchPost, uploadImage,getPost}