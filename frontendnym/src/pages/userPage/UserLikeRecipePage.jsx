import React, {useEffect, useState} from 'react';
import axios from "axios";
import Globe from "../../images/Globe.svg?react";
import Clock from "../../images/Clock.svg?react";
import s from "./userPage.module.css";
import {Link} from "react-router-dom";

export const UserLikeRecipePage = () => {
        const[likeRecipe,setLikeRecipe] = useState([])
        const[loading,setLoading] = useState(true)

        useEffect(()=>{RecipeLike()},[])
        const userToken = localStorage.getItem('user');
        const RecipeLike = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/recipes/liked", {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                setLikeRecipe(response.data)
                setLoading(false)
            } catch (error) {
                console.error(error)
                setLoading(false)
            }
        }
        async function dislike(id){
                try {
                    const response = await axios.post(
                        `http://localhost:8080/api/recipes/unlike`,
                        null,
                        {
                            params: { recipeID: id },
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            }
                        }
                    );
                    location.reload();
                } catch (error) {
                    console.error('Ошибка удаления из избранного:', error.response ? error.response.data : error.message);
                }
            }

    function RecipePartUser(props){
        let nameRecipe = props.part
        let time = nameRecipe.preparationTime
        let min = time
        let hour =  Math.trunc(time / 60)
        if(hour !== 0){
            min = time % 60
        }
        return(
            <div>
                <img src={nameRecipe.imageUrl} alt=""/>
                <div  className={"timeInBlock"}>
                    <div className={"blockInfo"}>
                        <Globe/>
                        <p>{nameRecipe.cuisine}</p>
                    </div>
                    <div className={"blockInfo"}>
                        <Clock/>
                        {hour===0?<p  >{min} минут</p>:<p >{hour} часа {min} минут</p>}
                    </div>
                </div>
                <p className={s.titleCart}>{nameRecipe.title}</p>
            </div>
        )
    }
    const UserLikeRecipe = () =>{
        return likeRecipe.map((i)=>{
            return(
                <div className={s.recipeCart }  key={i.id}>
                    <Link  style={{width:"60%"}} to={`/recipes/${i.id}`}>
                        <RecipePartUser part={i}/>
                    </Link>
                    <button className={s.buttonCart} onClick={()=>{dislike(i.id)}}>Убрать из избранного</button>
                </div>
            )
        })
    }
    return (
        <div className={s.userPage}>
            <UserLikeRecipe/>
        </div>
    );
};

