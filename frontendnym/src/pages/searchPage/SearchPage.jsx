import React, {useEffect} from 'react';
import s from "./styleSearch.module.css";
import SearchI from "../../images/SearchIcons.svg?react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

let SearchChange = "";
export const SearchNav = () => {
    const navigateSearchPage = useNavigate()
    return (
        <div className={s.DivSearch}>
            <input onChange={(e)=>{SearchChange=e.target.value}} type="text"/>
            <SearchI onClick={()=>navigateSearchPage("/search")}/>
        </div>
    );
}
export const SearchPage = () => {
    let ArrRecipe = [];
    useEffect(()=>{
        const Recipe = async() =>{
            try {
                const response = await axios.get('http://localhost:8080/api/recipes')
                ArrRecipe = response.data

            }
            catch (error){
                console.error(error)
            }
        }
        Recipe()
    },[])
    return (
        <div>
            <SearchNav/>
        </div>
    );
};

