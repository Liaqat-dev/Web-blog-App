import React, {createContext, useContext} from "react";

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

interface SearchContextType {
    searchResult: SearchResultItem[];
    setSearchResult: React.Dispatch<React.SetStateAction<SearchResultItem[]>>;
    handleSearch: (query: string) => Promise<void>;
    resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType >({
    searchResult:[],
    setSearchResult:()=>{},
    handleSearch:async ()=>{},
    resetSearch:()=>{}

});

const useSearch = () => useContext(SearchContext);

export {useSearch, SearchContext};
export type { SearchResultItem };
