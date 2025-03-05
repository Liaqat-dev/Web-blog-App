import {FaSearch} from "react-icons/fa";
import {IoClose} from "react-icons/io5";
import './topbar.css'
import {useSearch} from "../../context/useSearch.ts";
import React, {useState} from "react";


function SearchForm() {
    const [query, setQuery] = useState("");
    const { handleSearch, resetSearch} = useSearch();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim())
            return;
        handleSearch(query);
    }
    const handleReset = () => {
        console.log('handleReset');
        resetSearch();
        setQuery('')
    }

    return (
        <div className={'search'}>
            <form onSubmit={handleSubmit}>
                <input className={'input'} placeholder={'Search here...'} value={query}
                       onChange={(e) =>{ setQuery(e.target.value);setTimeout(()=>{handleSearch(query)},100); }} />
            </form>
            <button onClick={() => handleReset()} className={'searchIcon'}>{query.trim() ? <IoClose/> :
                <FaSearch/>}</button>
        </div>
    );
}

export default SearchForm;