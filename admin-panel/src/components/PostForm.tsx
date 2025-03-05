import Button from './button.tsx'
import {BiImageAdd} from "react-icons/bi";
import {ImSpinner3} from "react-icons/im";
import {MdContentCopy} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {uploadImage} from "../api/post.ts";
import {useNotification} from "../context/useNotification.ts";

interface Props {
    initialPost?: {
        title: "",
        thumbnail: null,
        content: "",
        tags: '',
        meta: '',
        featured: 'false',
    }
    submitButtonTitle: "Update" | "Post",
    onSubmit: (data: FormData) => void
}

const PostForm = ({onSubmit, submitButtonTitle, initialPost}: Props) => {
    const defaultPost = {
        title: "",
        thumbnail: null,
        content: "",
        tags: '',
        meta: '',
        featured: 'true',
    }


    const mdRules = [
        {title: "From h1 to h6", rule: "# Heading -> ######Heading"},
        {title: "Blockquote", rule: "> Your Quote"},
        {title: "Image", rule: "! [image alt](https://image_url.com)"},
        {title: "Link", rule: "[Link Text] (http://your_link. com)"},
    ];

    const [postInfo, setPostInfo] = useState(defaultPost);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [uploadImageURL, setUploadImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const {updateNotification} = useNotification();


    useEffect(() => {
        if (initialPost) {
            console.log(initialPost);
            setPostInfo({ ...initialPost });
            if(initialPost.thumbnail){
                setThumbnailUrl(initialPost.thumbnail);
            }
        }
    }, [initialPost]);

    const {title, tags, content, meta, featured} = postInfo;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name, checked} = event.target;
        if (name === "thumbnail") {
            const file = event.target.files?.[0];
            if (!file?.type.includes('image')) {
                return updateNotification('error', "Please select an image type file");
            }
            setPostInfo({...postInfo, thumbnail: file});
            return setThumbnailUrl(URL.createObjectURL(file));
        }
        if (name === "featured") {
            return setPostInfo({...postInfo, featured: checked.toString()});

        }
        if (name === "tags") {
            const newTags = tags.split(",");
            if (newTags.length > 4) {
                updateNotification('warning', 'Only first 4 tags will be added.');
            }
            return setPostInfo({...postInfo, [name]: value});
        }
        setPostInfo({...postInfo, [name]: value})

    }

    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {value, name} = event.target;
        if (name === "meta" && meta.trim().length > 150) {
            updateNotification('warning', 'meta of 150 characters will be selected')
            return setPostInfo({...postInfo, [name]: value.substring(0, 150)})
        }
        setPostInfo({...postInfo, [name]: value})
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newTags = tags
            .split(",").map((item) => item.trim())
            .splice(0, 4);

        if (!title.trim()) return updateNotification('error', 'Missing title');
        if (!content.trim()) return updateNotification('error', 'Missing content');
        if (newTags.length < 1) return updateNotification('error', 'tags must not be empty');

        const slug = title
            .toLowerCase()
            .replace(/[^a-zA-Z]/g, ' ')
            .split(' ')
            .filter(item => item.trim())
            .join('-');

        const formData = new FormData();
        const finalPost = {...postInfo, slug: slug, tags: JSON.stringify(newTags)};

        // for (const key in finalPost) {
        //     formData.append(key, finalPost[key as keyof typeof finalPost] as string);
        // }
        Object.entries(finalPost).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
                console.log('added file');
            } else {
                formData.append(key, String(value));
            }
        });

        onSubmit(formData);

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
    }
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (uploading) return;
        const file = e.target.files?.[0];
        if (!file?.type.includes('image')) {
            return updateNotification('error', "Please select an image type file");
        }
        setUploading(true)
        const formData = new FormData();
        formData.append("image", file);
        const {response, error} = await uploadImage(formData);
        setUploading(false);
        if (error) {
            return updateNotification('error', `Upload failed: ${error}`);
        }
        setUploadImageUrl(response?.data.image);
    }

    const handleOnCopy = () => {
        const textToCopy = `! [image description here](${uploadImageURL})`
        navigator.clipboard.writeText(textToCopy)
            .then(() => updateNotification('success', 'Copied to Clipboard')
            );

    }


    return (
        <form className={'flex boxShadow gap-2 h-full'} style={{padding: 5}} onSubmit={handleSubmit}>
            {/*//Left*/}
            <div className={'flex flex-col flex-3  bg-cyan-400 h-full max-h-full overflow-y-scroll'}>
                {/*topBar*/}
                <div className={'flex justify-around items-center'}>
                    <h3>Create New Post</h3>
                    <div>
                        <Button type={'button'} variant={'Secondary'}>Reset</Button>
                        <Button type={'button'} variant={'Primary'}>View</Button>
                        <Button type={'submit'} variant={'Primary'}>{submitButtonTitle}</Button>
                    </div>
                </div>
                <div className={'w-full h-0.5 bg-blue-50'}/>

                {/*Featured */}
                <div className={'flex gap-1 justify-start items-center'}>
                    <input
                        checked={postInfo.featured} onChange={handleInputChange} name={'featured'} id={'featured?'}
                           className={'w-4 h-4'} type={'checkbox'}/>
                    <label className={'select-none'} htmlFor={'featured?'}>Featured</label>
                </div>

                {/*Title*/}
                <input value={title} name={'title'} onChange={handleInputChange} type={'string'}
                       className={'w-[90%] bg-white outline-0 rounded-md'}
                       placeholder={'Post Title'}
                       style={{margin: 4, height: 30, paddingLeft: 10, paddingRight: 10}}/>

                {/*Upload Image*/}
                <div className={'flex gap-1 justify-start items-center '}>
                    <div className={'flex border-[1px] rounded-md'} style={{padding: 0.5, margin: 3}}>
                        <input id={'image-Upload'} accept={'image/*'} onChange={handleImageUpload} type={'file'}
                               hidden={true}/>
                        <label htmlFor={'image-Upload'}
                               className={'flex items-center gap-1'}><span
                            className={'text-sm font-semibold'}>Upload Image</span>{
                            uploading ?
                                <ImSpinner3 size={20} className={'animate-spin'}/> :
                                <BiImageAdd size={20}/>
                        }</label>

                    </div>
                    <div className={'flex relative items-center flex-[0.88]'}>
                        <input disabled={true} value={uploadImageURL}
                               className={' flex-1   bg-white font- outline-0 rounded-md'}
                               style={{paddingLeft: 10, paddingRight: 25}}/>
                        <button type={'button'} onClick={handleOnCopy} className={'absolute right-1 z-20'}><MdContentCopy/></button>
                    </div>
                </div>

                {/*Content*/}
                <textarea value={content} onChange={(e) => handleTextAreaChange(e)} name={'content'}
                          placeholder={'Markdown Here'}
                          className={'resize-none font-mono bg-white font-semibold  max-h-[90%] min-h-[70%]'}/>

                {/*Tags*/}
                <div className={'flex flex-col gap-1 justify-start '}>
                    <label htmlFor={'tags'}>Tags</label>

                    <input value={postInfo.tags} onChange={handleInputChange} name={'tags'} id={'tags'} type={'string'}
                           className={'w-[90%] bg-white outline-0 rounded-md'}
                           placeholder={`Tags ',' seperated`}
                           style={{margin: 4, height: 30, paddingLeft: 10, paddingRight: 10}}/>
                </div>

                {/*Meta Description*/}
                <div className={'flex flex-col gap-1 justify-start '}>
                    <label htmlFor={'meta'}>Meta Description {meta.trim().length}/150</label>
                    <textarea value={meta} onChange={handleTextAreaChange} name={'meta'} id={'meta'}
                              className={'resize-none bg-white font-semibold  '}
                              placeholder={`Meta Description`}
                              style={{margin: 4, paddingLeft: 10, paddingRight: 10}}/>
                </div>
            </div>


            {/*//Right*/}
            <div className={'flex-1 bg-[#eeeeee] h-full '} style={{padding: 2}}>
                {/*Thumbnail*/}
                <div>
                    <p className={'font-semibold font-sans'}>Thumbnail</p>
                    {thumbnailUrl ? <img src={thumbnailUrl} alt={'Thumbnail'}/>
                        : <div>
                            <input name={'thumbnail'} accept={'image/*'} onChange={handleInputChange} id={'thumbnail'}
                                   type={'file'}
                                   hidden={true}/>
                            <label htmlFor={'thumbnail'}>
                                <div
                                    className={'flex flex-col justify-center items-center border-2 border-blue-500 border-dashed aspect-video'}>
                                    <span className={'text-gray-500'}>Select Thumbnail</span>
                                    <span className={'text-gray-400 text-xs'}>Recommended Size</span>
                                    <span className={'text-gray-400 text-xs'}>1280x720</span>
                                </div>
                            </label>
                        </div>

                    }
                </div>

                {/*    Markdown RULES*/}
                <div className={'flex flex-col  justify-start '}>
                    <h2>General Markdown Rules</h2>
                    <div>
                        <ul>
                            {
                                mdRules.map((item, i) => {
                                    return (
                                        <li key={i} className={'flex flex-col justify-start'}>
                                            <span className={'text-sm font-semibold'}>{item.title}</span>
                                            <span className={'font-mono text-gray-400 text-xs '}>{item.rule}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>

                    </div>
                </div>
            </div>
        </form>
    );
};

export default PostForm;