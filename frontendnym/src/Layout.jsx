import React, {useEffect, useState} from 'react';
import {HeaderNav} from "./HeaderNav.jsx";
import {Route, Routes} from "react-router-dom";
import {NYm} from "./pages/home/nYm.jsx";
import {CreaterRecipePage} from "./pages/CreateRecipe/CreaterRecipePage.jsx";
import {SearchPage} from "./pages/searchPage/SearchPage.jsx";
import {LogIn} from "./pages/auth/LogIn.jsx";
import {SignUp} from "./pages/auth/SignUp.jsx";
import {TestPage} from "./testPage.jsx";
import {UserPage} from "./pages/userPage/UserPage.jsx";
import {RecipePage} from "./pages/RecipePage/RecipePage.jsx";
import {AdminPage} from "./pages/Admin/AdminPage.jsx";
import {UserLikeRecipePage} from "./pages/userPage/UserLikeRecipePage.jsx";
export const Layout = () => {
    return (
            <div className={"fullPage"}>
                <HeaderNav/>
                <section>
                <Routes>
                    <Route path="/" element={<NYm/>}/>
                    <Route path="/createrRecipe" element={<CreaterRecipePage/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/recipes/:id" element={<RecipePage/>} />
                    <Route path="/signUp" element={<SignUp/>}/>
                    <Route path="/test" element={<TestPage/>}/>
                    <Route path="/user" element={<UserPage/>}/>
                    <Route path="/like" element={<UserLikeRecipePage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                </Routes>
                </section>
            </div>
    );
};

