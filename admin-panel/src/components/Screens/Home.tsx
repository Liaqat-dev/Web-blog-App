import {useEffect, useState} from "react";
import {getPosts, deletePost} from "../../api/post.ts";
import PostCard from "../postCard.tsx";
import {useSearch} from "../../context/useSearch.ts";


const Home = () => {
    const {searchResult} = useSearch();
    const [FetchedPosts, setFetchedPosts] = useState([]);
    const [pageNo, setPageNo] = useState(0)
    const [paginationData, setPaginationData] = useState({
        totalPosts: 0,
        totalPages: 0,
        currentPage: 0,
        postsPerPage: 0,
    });


    const POST_LIMIT = 6;
    const fetchPosts = async (pageNo: number, POST_LIMIT: number) => {
        const response = await getPosts(pageNo, POST_LIMIT);
        setFetchedPosts(response["posts"]);
        setPaginationData(response["pagination"])

    }
    const handleDelete = async (post: { id: string }) => {
        const {id} = post;

        const confirmed = window.confirm('Are You Sure');
        if (!confirmed) return;
        const response = await deletePost(post.id);
        if ('error' in response) {
            console.log(response.error);
        } else {
            console.log(response.message);
        }
        const newPosts = FetchedPosts.filter(e => e.id !== id);
        setFetchedPosts(newPosts);
    }
    const pageArray = new Array(paginationData.totalPages).fill(" ");

    useEffect(() => {
        fetchPosts(pageNo, POST_LIMIT)
            .then(() => {
                console.log(`Fetching Data for page ${pageNo}`);
            });
    }, [pageNo]);


    console.log(FetchedPosts);
    return <div>
        <div className={'grid grid-cols-3 gap-1 w-full h-full '}>
            {searchResult.length?
                searchResult.map((post, index) => (
                    <PostCard post={post} key={index} handleDelete={() => handleDelete(post)}/>
                ))
                :
                FetchedPosts.map((post, index) => (
                    <PostCard post={post} key={index} handleDelete={() => handleDelete(post)}/>
                ))
            }
        </div>
        <div className={'flex gap-1 justify-center'}>
            {
                searchResult.length!<1? pageArray.map((_, index) => (
                    <button onClick={() => setPageNo(index)}
                            className={index == pageNo ? 'inline text-blue-500 border-b-2 border-blue-500 font-lg  font-bold' : 'inline text-black font-sm'}
                            key={index}>{index + 1}</button>
                ))
                    :null
            }
        </div>
    </div>
};

export default Home;