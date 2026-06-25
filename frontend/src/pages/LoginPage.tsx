import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { setToken } from '../auth/token';

export function LoginPage() {
	const navigate = useNavigate();
	const [loginValue, setLoginValue] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const location = useLocation();
	const successMessage = (location.state as { message?: string } | null)?.message;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		setError("");
		try {
			const res = await login(loginValue, password);
			setToken(res.access_token);
			navigate("/");
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка входа");
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
			<h1>Вход</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} placeholder="login" />
      		<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      		<button type="submit">Войти</button>
			<Link to="/register">Регистрация</Link>
		</form>
	)
}