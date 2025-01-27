import React, { useState} from 'react';
import s from "./styleCreateRecipe.module.css";
import {CheckSpace} from "./CheckSpace.js";
// import {CheckSpace} from "./CreaterRecipePage.jsx";

export const RecipeStep = (props) => {
    const [stepsInCom, setStepsInCom] = useState([{stepN: 1 , description:""}]);
    const stepNumber = stepsInCom.length + 1
    const stepObj = {stepN: stepNumber , description:""};
    let error = false;
    const StepByStepElement = (stepByStepProps) => {
            function CheckStepDescription(e){
                stepByStepProps.step.description = e.target.value
                console.log(error)
                if( CheckSpace(e)){
                    error = true;
                }else{
                    error = false;
                }
        }
        return (
            <div className={s.RecipePage}>
                <h3>Шаг {stepByStepProps.step.stepN}</h3>
                <form>
                    <label style={{textAlign:'left'}}>Описание шага</label>
                    <textarea onChange={CheckStepDescription} placeholder={'Например:"Почистите овощи, вскипятите воду"'} wrap={"hard"} defaultValue={stepByStepProps.step.description}>
                    </textarea>
                </form>
            </div>
        );
    }
    function createNewStep(e){
        e.preventDefault()
        if(error === false){
            return  alert("Заполните описание шага ")
        }
        props.getError(error)
        let coolSteps = stepsInCom
        coolSteps.push(stepObj)
        setStepsInCom([...coolSteps]);
        props.getStep(stepsInCom)
    }
    return (
        <div className={s.stepRecipe}>
            <h2>Как приготовить / пошаговая инструкция</h2>
            <div className={s.stepRecipe}>
                {
                    stepsInCom.map((i)=> {
                        return (
                            <StepByStepElement step={i} key={i.stepN}/>
                        )
                    })
                }
            </div>
            <button onClick={createNewStep}>Добавить шаг</button>
        </div>
    );
};
