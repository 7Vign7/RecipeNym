import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Logo  from './images/logo.svg?react';
import EditButton from "./images/edit.svg?react";
import Favorites from "./images/heart.svg?react";
import Profile from "./images/user.svg?react";
import s from './styleNav.module.css'
// import {SearchNav} from "./pages/searchPage/SearchPage.jsx";




export const HeaderNav = () => {

    let user = localStorage.getItem("user")

    function TrueUser (){
        return (
                <nav className={s.trueUser}>
                    <Link to="/">
                        <Logo/>
                    </Link>
                    <Link to="/createrRecipe" >
                        <EditButton/>
                    </Link>
                    {/*<SearchNav/>*/}
                    <Link to="/like" >
                        <Favorites/>
                    </Link>
                    <Link to="/user">
                        <Profile/>
                    </Link>
                </nav>
        );
    };
    function FalseUser (){
        return (
                <nav className={s.falseUser}>
                    <Link to="/">
                        <Logo/>
                    </Link>
                    {/*<SearchNav/>*/}
                    <Link to="/login">
                        <Profile/>
                    </Link>
                </nav>
        );
    };




    return (
        <header className={s.navi}>
        {
            user?<TrueUser/>:<FalseUser/>
        }
        </header>
    );
};
