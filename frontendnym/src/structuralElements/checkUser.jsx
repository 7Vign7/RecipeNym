import React from 'react';
import {jwtDecode} from 'jwt-decode';
export const CheckUser = (props) => {
    let tokenUser = localStorage.getItem("user");
    if(!tokenUser){
        return false
    }
    try{
        if("admin"){
            const decoded = jwtDecode(tokenUser);
            return decoded.role === 'ADMIN';
        }
        if("user"){
            const decoded = jwtDecode(tokenUser);
            return decoded.role !== '';
        }
    }
    catch (error){
        console.error('Ошибка декодирования токена:', error);
        return false; // Если что-то пошло не так
    }
};

