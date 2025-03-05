import '../../public/global.css'
import dateFormat from 'dateformat'

import {RiDeleteBin6Fill} from "react-icons/ri";
import {MdEditDocument} from "react-icons/md";
import {Link} from "react-router";

interface Props {
    post: {
        id: string,
        title: string,
        thumbnail: string,
        slug: string
        meta: string,
        content: string,
        tags: Array<string>,
        createdAt: Date;
    },
    handleDelete: (post: { id: string }) => void;
}

function PostCard({post, handleDelete}: Props) {


    return (
        <div key={post.id} className={'w-80  flex flex-col   bg-cyan-400 boxShadow '}
             style={{margin: 5, border: 0, borderRadius: 5, marginTop: 10}}>
            <img src={post.thumbnail || './blankThumbnail.png'} alt={post.title}/>
            <div className={'flex flex-1 flex-col justify-between'} style={{padding: 4}}>
                <div>
                    <p className={'font-semibold'}>{post.title}</p>
                    <p>{post.meta.substring(0, 80) + '...'}</p>
                </div>

                <div className={'flex space-x-5 gap-3'}>
                    <Link style={{padding: 7}}
                          className={' rounded-sm bg-blue-500 hover:bg-blue-600'}
                          to={`/update-post/:${post.slug}`}><MdEditDocument color={'white'} size={20}/></Link>
                    <button style={{padding: 7}} className={' rounded-sm bg-red-500 hover:bg-red-600'}
                            onClick={() => handleDelete(post)} ><RiDeleteBin6Fill color={'white'} size={20}/></button>

                </div>

                <div className={' flex justify-between '}>
                    <p className={' text-gray-500 text-sm'}>{dateFormat(post.createdAt, "mediumDate")}</p>
                    <p className={'text-gray-500 text-sm'}>{post.tags.join(",")}</p>
                </div>
            </div>
        </div>
    );
}

export default PostCard;