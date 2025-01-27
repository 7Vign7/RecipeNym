import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Heart from "../../images/heart.svg?react"
import s from "./recipePage.module.css"
import {set} from "mobx";
export const RecipePage = () => {
    const { id } = useParams(); // Получаем id из URL
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/recipes/${id}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки рецепта:', error);
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!recipe) {
        return <p>Рецепт не найден=(</p>;
    }
    function ServingsCount(){
        const [countServings,setCountServings] = useState(recipe.servings)
        function incr(){
            setCountServings(countServings + 1)
        }
        function dincr(){
            if(countServings === 1 ){
                return
            }
            setCountServings(countServings - 1)
        }
        return(
            <div className={s.setingsRecipe}>
                <div className={s.countServings}>
                    <h3>Количество порций:</h3>
                    <button onClick={dincr} >-</button>
                    <p>{countServings}</p>
                    <button onClick={incr} >+</button>
                </div>
                <div className={s.ingredientsRecipe}>
                    {recipe.ingredients.map((ingredient) => {
                        let oneServings = (ingredient.quantity / recipe.servings) * countServings
                        return(
                            <p key={ingredient.id}>
                                {ingredient.name} — {oneServings} {ingredient.unit}
                            </p>
                        )
                    })}
                </div>
                <h3>Время приготовления: {recipe.preparationTime} минут</h3>
            </div>
        )
    }

    return (
        <div className={s.recipePage}>
            <div style={{display:'flex',alignItems:'center',justifyContent:"space-between"}}>
                <h1>{recipe.title}</h1>
                <Heart onClick={async ()=>{
                    try {
                        const response = await axios.post(
                            `http://localhost:8080/api/recipes/like`, // URL
                            null, // Нет тела запроса
                            {
                                params: { recipeID: id },
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('user')}`, // Добавляем токен
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        alert('Избранное обновлено!');
                        console.log(response.data);
                    } catch (error) {
                        console.error('Ошибка обновления избранного:', error);
                    }
                }} />
            </div>
            <img src={recipe.imageUrl}/>
            <p>{recipe.description}</p>
            <ServingsCount/>
            <div>
                {recipe.steps.map((step) =>
                    {
                        return (
                            <div key={step.id} style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                <h2>Шаг {step.stepN}</h2>
                                <div className={s.stepByStep}>
                                    <img src={step.image.url} alt={`Шаг ${step.stepN}`} width="200" />
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        )
                    }
                )}
            </div>
        </div>
    );
};
