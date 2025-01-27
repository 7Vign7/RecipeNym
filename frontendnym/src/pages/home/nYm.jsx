import React, {useEffect, useState} from 'react';
import axios from "axios";
import "../../index.css"
import {Link} from "react-router-dom";
import Clock from "../../images/Clock.svg?react"
import Globe from "../../images/Globe.svg?react"


export const NYm = () => {
    const[fullRecipe,setFullRecipe] = useState([])
    const[loading,setLoading] = useState(true)
    useEffect( ()=>{
            const Recipe = async() =>{
                try {
                    const response = await axios.get('http://localhost:8080/api/recipes')
                    setFullRecipe(response.data)
                    setLoading(false)
                }
                catch (error){
                    console.error(error)
                    setLoading(false)
                }
            }
            Recipe()
    },[])

    function RecipePart(props){
        let nameRecipe = props.part
        let time = nameRecipe.preparationTime
        let min = time
        let hour =  Math.trunc(time / 60)
        if(hour !== 0){
            min = time % 60
        }
        return(
            <div style={{border:"3px solid #0000000e", padding:"5%" , borderRadius: "10%"}}>
                <img src={nameRecipe.imageUrl} style={{width:"100%"}} alt={nameRecipe.title}/>
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
                <p style={{margin:"10px",textAlign:"center",fontSize: "25px"}}>{nameRecipe.title}</p>
            </div>
        )
    }

    return (
        <div style={{display: "flex",
            flexDirection: "column",
            alignItems: "center",gap: "20px"}}>
            {
                fullRecipe.map((i)=>{
                    return(
                        <Link key={i.id} style={{width:"60%"}} to={`/recipes/${i.id}`}>
                            <RecipePart part={i}/>
                        </Link>
                    )
                })
            }
        </div>
    );
};

