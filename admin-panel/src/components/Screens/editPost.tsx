import PostForm from "../PostForm.tsx";
import { useParams} from "react-router";
import { getPost, updatePost} from "../../api/post.ts";
import {useEffect, useState} from "react";
import {useNotification} from "../../context/useNotification.ts";


function EditPost() {
    const {slug} = useParams();

    const trimmedSlug = slug?.substring(1, slug?.length)


    const defaultPost = {
        id: '',
        title: " ",
        thumbnail: null,
        content: " ",
        tags: '  ',
        meta: ' ',
        featured: 'false',
    }


    const [postInfo, setPostInfo] = useState(defaultPost);

    const fetchPost = async () => {
        const data = await getPost(String(trimmedSlug));

        setPostInfo({...data.post, tags: data.post.tags.join(', ')})
    }


    const {updateNotification} = useNotification()


    const handleSubmit = async (data: FormData) => {
        const {error, post} = await updatePost(postInfo.id,data);
        if (error) return updateNotification("error", `error: ${error} `)
        setPostInfo({...post});

    }


    useEffect(() => {
        fetchPost();
    }, [])
    return <PostForm initialPost={postInfo} onSubmit={handleSubmit} submitButtonTitle={"Update"}/>
}

export default EditPost;