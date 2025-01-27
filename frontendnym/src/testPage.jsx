import React from 'react';
import {AnimationLoading} from "./loading/AnimationLoading.jsx";
import axios from "axios";
import {CheckUser} from '../src/structuralElements/checkUser'

export const TestPage = () =>{
    // const testJWT = () =>{
    //     let tokenUser = localStorage.getItem("user");
    //     if(!tokenUser){
    //         return false
    //     }
    //     try{
    //         const decoded = jwtDecode(tokenUser);
    //         console.log(decoded.role)
    //         return decoded.role === 'ADMIN';
    //     }
    //     catch (error){
    //         console.error('Ошибка декодирования токена:', error);
    //         return false; // Если что-то пошло не так
    //     }
    //
    //     // let tokenParts = tokenUser.split(".");
    //     // let decoderHeader = JSON.parse(atob(tokenParts[0]));
    //     // let decoderPayload = JSON.parse(atob(tokenParts[1]));
    //     // console.log(decoderPayload)
    //     // let arr = [2,4,5,6,7]
    //     //
    //     // arr.map((i)=>{
    //     //     console.log(i)
    //     // })
    // }
    return (
        <div>

        </div>
    );
}

