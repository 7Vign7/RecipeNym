import React, {useEffect,useState} from 'react';
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {Link, useNavigate} from "react-router-dom";
import {qunit} from "globals";
import s from "./userPage.module.css"
import Globe from "../../images/Globe.svg?react";
import Clock from "../../images/Clock.svg?react";

export const UserPage = () => {
        const[likeRecipe,setLikeRecipe] = useState([])
        const[fullRecipe,setFullRecipe] = useState([])
        const[loading,setLoading] = useState(true)
        const userToken = localStorage.getItem('user');
        const userInfo = jwtDecode(userToken)
        const userId = userInfo.id
        const navigateNym = useNavigate();
        const[navPage, setNavPage] = useState("userRecipe")
        useEffect( ()=>{
            Recipe()
            RecipeLike()
        },[])

        const Recipe = async() =>{
        try {
            const response = await axios.get(`http://localhost:8080/api/recipes/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            setFullRecipe(response.data)
            setLoading(false)

        }
        catch (error){
            console.error(error)
            setLoading(false)
        }
        }
        const RecipeLike = async () =>{
        try {
            const response = await axios.get("http://localhost:8080/api/recipes/liked", {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });
            setLikeRecipe(response.data)
            setLoading(false)
        }
        catch (error){
            console.error(error)
            setLoading(false)
        }
        }
        async function deleteRecipe(id){
            try {
                const response = await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });
                console.log("fffff")
                location.reload();
            } catch (error) {
                console.error('Ошибка удаления рецепта:', error.response ? error.response.data : error.message);
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
        const UserRecipe = () =>{
            return fullRecipe.map((i)=>{
                return(
                    <div className={s.recipeCart } key={i.id} >
                        <Link  style={{width:"60%"}} to={`/recipes/${i.id}`}>
                            <RecipePartUser part={i} buttonType={true} />
                        </Link>
                        <button className={s.buttonCart} onClick={()=>{deleteRecipe(i.id)}}>Удалить рецепт</button>
                    </div>
                )
            })
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
        const controlNavRecipeUser = () =>{
            setNavPage("userRecipe")
        }
        const controlNavLike = ()=>{
            setNavPage("likeRecipe")
        }

        const CheckNav = ()=>{
            switch (navPage){
                case "userRecipe":
                    return <UserRecipe/>
                case "likeRecipe":
                    return <UserLikeRecipe/>
                default:
                    return <UserRecipe/>
            }
        }
        return (
            <div className={s.userPage}>
                <div className={s.userName}>
                    <h1>{userInfo.sub}</h1>
                    <button onClick={()=>{
                        localStorage.removeItem("user")
                        navigateNym("/")
                        location.reload();
                    }
                    }>Выйти</button>
                </div>
                <div className={s.navUserPage}>
                    {navPage!=="userRecipe"?<h2 className={s.noActive} onClick={controlNavRecipeUser}>Рецепты пользователя</h2>:<h2 className={s.active} onClick={controlNavRecipeUser}>Рецепты пользователя</h2>}
                    {navPage!=="likeRecipe"?<h2 className={s.noActive} onClick={controlNavLike}>Избранные рецепты</h2>:<h2 className={s.active} onClick={controlNavLike}>Избранные рецепты</h2>}
                </div>
                <CheckNav/>
            </div>
        );
};

