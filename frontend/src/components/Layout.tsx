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
			<nav className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-4 py-3">
				<Link to="/" className='text-sm font-medium text-gray-700 hover:text-accent'>
					Главная
				</Link>
				<Link to="/animaltypes" className="text-sm font-medium text-gray-700 hover:text-accent">
					Типы животных
				</Link>
				<Link to="/breeds" className="text-sm font-medium text-gray-700 hover:text-accent">
					Породы
				</Link>
				<Link to="/animals" className="text-sm font-medium text-gray-700 hover:text-accent">
					Животные
				</Link>
				<Link to="/weightings" className="text-sm font-medium text-gray-700 hover:text-accent">
					Взвешивания
				</Link>
				{isAdmin && 
					<Link to="/users" className="text-sm font-medium text-gray-700 hover:text-accent">
						Пользователи
					</Link>
				}
				<button 
					type="button" 
					onClick={logout}
					className="ml-auto rounded-md bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
				>Выйти</button>
			</nav>
			<main className="p-6 text-left">
				<Outlet />
			</main>
		</>
	);
}