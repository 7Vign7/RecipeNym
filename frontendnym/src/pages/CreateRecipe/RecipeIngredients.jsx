import React, {useState} from 'react';
import s from "./styleCreateRecipe.module.css";
import {CheckSpace} from "./CheckSpace.js";
import {formToJSON} from "axios";


export const RecipeIngredients = (props) => {
    const [ingredientsInCom, setIngredientsInCom] = useState([{name:"", quantity:0, unit:""}]);
    const ingredientObj = {name:"", quantity:0, unit:""}
    let error = false

    const BlockIngredients = (ingredientsProps) => {
        function CheckName(e) {
            ingredientsProps.ingredient.name  = e.target.value
            if( CheckSpace(e) ){
                error = true
            }else{
                error = false
            }
        }
        function CheckQuantity(e) {
            ingredientsProps.ingredient.quantity = +e.target.value
            if( CheckSpace(e) ){
                error = true
            }else{
                error = false
            }
        }
        function CheckUnit(e) {
            ingredientsProps.ingredient.unit = e.target.value
            if( CheckSpace(e) ){
                error = true
            }else{
                error = false
            }
        }
        return (
            <div className={s.RecipePage}>
                <form>
                    <input onChange={CheckName} placeholder={'Например: курица'} defaultValue={ingredientsProps.ingredient.name}/>
                    <input onChange={CheckQuantity} type={"number"} placeholder={'Кол-во'} defaultValue={ingredientsProps.ingredient.quantity}/>
                    <input onChange={CheckUnit} placeholder={"Выберите ед. измерения. Например: кг, г, шт и т.д."} defaultValue={ingredientsProps.ingredient.unit}/>
                </form>
            </div>
        );
    }

    function createNewIngredient(e){
        e.preventDefault()
        if(error === false){
            return  alert("Заполните все поля")
        }
        props.getError(error)
        let coolIngredients = ingredientsInCom
        coolIngredients.push(ingredientObj);
        setIngredientsInCom([...coolIngredients]);
        props.getIngredients(ingredientsInCom)
    }

    return (

        <div className={s.stepRecipe}>
            {
                ingredientsInCom.map((i,key)=>{
                    return(
                        <BlockIngredients ingredient={i} key={key}/>
                    )
                })
            }
            <button onClick={createNewIngredient}>Добавить Ингредиент
            </button>
        </div>
    );
};


