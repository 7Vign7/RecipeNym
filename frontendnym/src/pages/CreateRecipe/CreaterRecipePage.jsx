import React, {useEffect, useState} from 'react';
import s from "./styleCreateRecipe.module.css"
import {RecipeIngredients} from "./RecipeIngredients.jsx";
import {RecipeStep} from "./RecipeStep.jsx";
import {CheckSpace} from "./CheckSpace.js";
import axios from "axios";
import {Sorry} from "../../structuralElements/sorry.jsx";

export const CreaterRecipePage = () => {
    const userToken = localStorage.getItem("user")
    if(userToken){
        const [title,setTitle] = useState("");
        const [description,setDescription] = useState("");
        const [time,setTime] = useState(0);
        const [servings,setServings] = useState(0);
        const [cuisine,setCuisine] = useState("");
        const [min,setMin] = useState(0);
        const [hour,setHour]= useState(0);
        const [step,setStep] = useState([]);
        const [ingredients,setIngredients] = useState([]);

        const [errorStep,setErrorStep] = useState(false);
        const [errorIngredients,setErrorIngredients] = useState(false);
        const [errorTitle,setErrorTitle] = useState("Название рецепта не может быть пустым")
        const [errorDescription, setErrorDescription ] = useState("Описание не может быть пустым")
        const [errorTime,setErrorTime] = useState("Время не может быть пустым");
        const [errorServings,setErrorServings] = useState("Порции не могут быть пустыми");
        const [errorCuisine,setErrorCuisine] = useState("Национальная кухня не может быть пустой");

        const [formValid,setFormValid] = useState(false)

        function timeMaker(){
            let hourInMin = hour * 60
            setTime(hourInMin + min)
            if(time === 0){
                setErrorTime("Время не может быть пустым ")
            }else{
                setErrorTime("")
            }
        }
        function CheckTitle(e) {
            setTitle(e.target.value)
            if( CheckSpace(e) ){
                setErrorTitle("")
            }else{
                setErrorTitle("Название рецепта не может быть пустым")
            }
        }
        function CheckDescription(e) {
            setDescription(e.target.value)
            if( CheckSpace(e) ){
                setErrorDescription("")
            }else{
                setErrorDescription("Описание не может быть пустым")
            }
        }
        function CheckServings(e) {
            setServings(+e.target.value)
            if( CheckSpace(e) ){
                setErrorServings("")
            }else{
                setErrorServings("Порции не могут быть пустыми")
            }
        }
        function CheckCuisine(e) {
            setCuisine(e.target.value)
            if( CheckSpace(e) ){
                setErrorCuisine("")
            }else{
                setErrorCuisine("Национальная кухня не может быть пустой")
            }
        }


        useEffect(()=>{
            if((errorTime === errorTitle && errorTitle === errorDescription && errorDescription === errorCuisine && errorCuisine === errorServings)){ //&& (errorStep === true && errorStep === errorIngredients)
                setFormValid(true)
                console.log(formValid)
            }else{
                setFormValid(false)
                console.log(formValid)
            }
        },[errorTime,errorTitle,errorDescription,errorCuisine,errorServings,errorStep,errorIngredients])


        const CreateRecipe = async () => {

            const recipeData = {
                title: title,
                description: description,
                servings: servings,
                cuisine: cuisine,
                preparationTime: time,
                steps: step,
                ingredients: ingredients,
            }
            try{
                const response = await axios.post(
                    'http://localhost:8080/api/recipes',
                    recipeData
                    ,{
                        headers:{
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`
                        }
                    }
                )
                alert("Рецепт Добавлен!")
                console.log(recipeData)
            }
            catch(error){
                console.log(error)
                console.log(recipeData)
                alert(error.response.data)
            }
        }


        return (
            <div className={s.createRecipe}>
                <h2>Оформление рецепта</h2>
                <div className={s.RecipePage}>
                    На основе названия рецепта нейросеть сгенерирует обложку, также к каждому шагу вашего рецепта, будет также сгенерирована картинка
                </div>
                <div className={s.RecipePage}>
                    <form>
                        <label>
                            Название рецепта
                        </label>
                        <input onChange={CheckTitle} placeholder={'Например: Торт "Наполеон"'}/>
                        <label>Описание блюда</label>
                        <textarea onChange={CheckDescription} placeholder={"Расскажите, почему вы выбрали этот рецепт, каким будет готовое блюдо?"} wrap={"hard"}></textarea>
                        <label>Национальная кухня</label>
                        <input onChange={CheckCuisine} placeholder={'Например: русская или итальянская"'}/>
                    </form>
                </div>
                <h2>Параметры блюда</h2>
                <div className={s.RecipePage}>
                    <form>
                        <label>Порции</label>
                        <input onChange={CheckServings} type={"number"} min={1} max={40}/>
                        <label>Время приготовления</label>
                        <div  className={s.recipeTime}>
                            <div>
                                <input onChange={(e)=>{setHour(+e.target.value); timeMaker()}} type={"number"} min={0} max={12} defaultValue={0}/>
                                <span>Часов</span>
                            </div>
                            <div>
                                <input onChange={(e)=>{setMin(+e.target.value); timeMaker()}} type={"number"} min={0} max={59} defaultValue={0}/>
                                <span>Минут</span>
                            </div>
                        </div>
                    </form>
                </div>
                <h2>Ингредиенты</h2>
                <RecipeIngredients getIngredients={setIngredients} getError={setErrorIngredients}/>
                <RecipeStep getStep={setStep} getError={setErrorStep}/>
                <button onClick={CreateRecipe} >Отправить рецепт</button>
            </div>
        );
    }else{
        return (
            <Sorry/>
        )
    }
};

