import {ReactNode, useState} from "react";
import {searchPost} from "../api/post.ts";
import {SearchContext, } from './useSearch.ts'


interface SearchResultItem{
    id: string,
    title: string,
    thumbnail: string,
    slug: string
    meta: string,
    content: string,
    tags: Array<string>,
    createdAt: Date;
}
interface Props {
    children: ReactNode;
}

export function SearchProvider(props: Props) {
    const [searchResult, setSearchResult] = useState<SearchResultItem[]>([]);


    const handleSearch = async (query: string) => {
        const {error, posts} = await searchPost(query);
        if (error) return console.log(error)

        console.log(posts);
        setSearchResult(posts);
    }

    const resetSearch = () => {
        setSearchResult([]);
    }

    return <SearchContext.Provider value={{searchResult, setSearchResult, handleSearch, resetSearch}}>
        {props.children}
    </SearchContext.Provider>
}
