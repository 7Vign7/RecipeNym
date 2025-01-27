import React, { useEffect, useState } from 'react';
import { CheckUser } from "../../structuralElements/checkUser.jsx";
import { Sorry } from "../../structuralElements/sorry.jsx";
import axios from "axios";

export const AdminPage = () => {
    const userToken = localStorage.getItem("user");

    // Проверка роли пользователя
    if (CheckUser("admin")) {
        const [fullRecipe, setFullRecipe] = useState([]);
        const [users, setUsers] = useState([]); // Список пользователей
        const [loading, setLoading] = useState(true);

        // Загрузка рецептов
        useEffect(() => {
            const fetchData = async () => {
                try {
                    // Получение списка рецептов
                    const recipeResponse = await axios.get('http://localhost:8080/api/recipes', {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    setFullRecipe(recipeResponse.data);

                    // Получение списка пользователей
                    const userResponse = await axios.get('http://localhost:8080/api/admin/users', {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    setUsers(userResponse.data);

                    setLoading(false);
                } catch (error) {
                    console.error("Ошибка загрузки данных:", error);
                    setLoading(false);
                }
            };
            fetchData();
        }, [loading]);

        // Компонент для отображения рецептов
        function RecipePart(props) {
            const recipe = props.part;
            return (
                <div className={"blockAdmin"}>
                    <p>id: "{recipe.id}"</p>
                    <p>Автор: "{recipe.authorID}"</p>
                    <p>Название: "{recipe.title}"</p>
                    <button onClick={async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`http://localhost:8080/api/admin/recipes/${recipe.id}`, {
                                headers: {
                                    Authorization: `Bearer ${userToken}`
                                }
                            });
                            alert("Рецепт удалён");
                        } catch (error) {
                            console.error(error);
                            setLoading(false);
                        }
                    }}>Удалить Рецепт</button>
                </div>
            );
        }

        // Компонент для отображения пользователей
        function UserPart(props) {
            const user = props.part;
            return (
                <div className={"blockAdmin"}>
                    <p>id: "{user.id}"</p>
                    <p>Логин: "{user.username}"</p>
                    <p>Роль: "{user.role}"</p>
                    <button onClick={async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`http://localhost:8080/api/admin/users/${user.id}`, {
                                headers: {
                                    Authorization: `Bearer ${userToken}`
                                }
                            });
                            alert("Пользователь удалён");
                        } catch (error) {
                            console.error(error);
                            setLoading(false);
                        }
                    }}>Удалить Пользователя</button>
                </div>
            );
        }

        return (
            <div>
                <h1>Управление Рецептами</h1>
                {fullRecipe.map((i) => (
                    <RecipePart part={i} key={i.id} />
                ))}

                <h1>Управление Пользователями</h1>
                {users.map((u) => (
                    <UserPart part={u} key={u.id} />
                ))}
            </div>
        );
    } else {
        return <Sorry />;
    }
};
