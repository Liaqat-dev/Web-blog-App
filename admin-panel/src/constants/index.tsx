import {FaHome} from 'react-icons/fa';
import {CiEdit} from "react-icons/ci";
import Home from "../components/Screens/Home.tsx";
import CreatePost from "../components/Screens/createPost.tsx";
import EditPost from "../components/Screens/editPost.tsx";

export const navbarItems = [
    {icon: <FaHome size={35}/>, name: 'Home', path: '/'},
    {icon: <CiEdit size={35}/>, name: 'Create Post', path: '/create-post'},
    {icon: <CiEdit size={35}/>, name: 'Create Post', path: '/update-post/building-rest-api-express'},
];


export const routes = [
    {path: '/', element: <Home/>},
    {path: '/create-post', element: <CreatePost/>},
    {path: '/update-post/:slug', element: <EditPost/>},
    {path: '*', element: <Home/>},///not found page will be here

]

export const color=
{
    'primary':'#2a80d6',
    'secondary':'#fafbfd',
    'tertiary':'#f39f9f',
}

