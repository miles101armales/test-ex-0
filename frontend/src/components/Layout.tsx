import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../auth/token';
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";


export function Layout() {
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
	getMe()
		.then((me) => setIsAdmin(me.role === "admin"))
		.catch(() => setIsAdmin(false));
	}, []);

	function logout() {
		clearToken();
		navigate("/login", { replace: true });
	}

	return (
		<>
			<nav>
				<Link to="/">Главная</Link>
				<Link to="/animaltypes">Типы животных</Link>
				<Link to="/breeds">Породы</Link>
				<Link to="/animals">Животные</Link>
				<Link to="/weightings">Взвешивания</Link>
				{isAdmin && <Link to="/users">Пользователи</Link>}
				<button type="button" onClick={logout}>Выйти</button>
			</nav>
			<main>
				<Outlet />
			</main>
		</>
	);
}