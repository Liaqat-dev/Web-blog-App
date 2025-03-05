import PostForm from "../PostForm.tsx";
import {createPost} from "../../api/post.ts";
import {useNotification} from "../../context/useNotification.ts";
import {useNavigate} from "react-router";


const CreatePost = () => {
    const navigate = useNavigate();
    const {updateNotification} = useNotification()
    const handleSubmit = async (data: FormData) => {
        const {error, post} = await createPost(data);
        if (error) return updateNotification("error", `error: ${error} `)
       else navigate(`/update-post/${post.slug}`);

    }
    return <PostForm onSubmit={handleSubmit} submitButtonTitle={"Post"}/>
};

export default CreatePost;