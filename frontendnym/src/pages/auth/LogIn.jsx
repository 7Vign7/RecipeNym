import React, {useContext, useEffect, useState} from 'react';
import "../../index.css"
import s from "./auth.module.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const LogIn = () => {

    const [email,setEmail] = useState("")
    const [erorEmail,setErorEmail] = useState("Email не может быть пустым")
    const [erorPassword,setErorPassword] = useState("Пароль не может быть пустым")
    const [password, setPassword] = useState("")
    const [formValid,setFormValid] = useState(false)
    const navigateNym = useNavigate()
    const CheckEmail = (e) =>{
        setEmail(e.target.value)
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(String(e.target.value).toLowerCase())){
            setErorEmail("Неправильная почта")
        }else{
            setErorEmail("")
        }
    }
    const CheckPassword =(e)=>{
        setPassword(e.target.value)
        if(e.target.value.length < 3){
            setErorPassword("Пароль должен быть больше 3 символов")
        }
        else{
            setErorPassword("")
        }
    }
    useEffect((e)=>{
        if(erorPassword === erorEmail){
            setFormValid(true)
        }else{
            setFormValid(false)
        }
    },[erorPassword,erorEmail])


    async function postUserSignUp(e){
        e.preventDefault()
        const user={
            email: email,
            password: password
        }
        try{
            const response = await axios.post(
                'http://localhost:8080/api/auth/login',user,{
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }
            )
            const token = response.data
            localStorage.setItem('user',token)
            navigateNym("/user")
            location.reload();
        }
        catch(error){
                alert(error.response.data)
        }
    }

    const navigateToLogIn= useNavigate();
    return (
        <div className={s.auth} >
            <div className={s.seniorBlock}>
                <h1>Авторизация</h1>
                <form>
                    <h2>Почта</h2>
                    {erorEmail===""? <input type={"text"}  onChange={CheckEmail} placeholder={"Введите свою почту"}/>:<input type={"text"}  className={"notValidInput"}  onChange={CheckEmail} placeholder={"Введите свою почту"}/>}
                    <h2>Пароль</h2>
                    {erorPassword===""?<input type={"password"} onChange={CheckPassword} placeholder={"Введите пароль"}/>:<input type={"password"}  className={"notValidInput"}  onChange={CheckPassword} placeholder={"Введите пароль"}/> }
                    <div className={s.footerButton}>
                        <button onClick={()=>navigateToLogIn("/signup")} >Регистрация</button>
                        {formValid?<button onClick={postUserSignUp}>Войти</button>:<button onClick={(e)=>e.preventDefault()} className={"deadButton"}>Войти</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

