import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export function RegisterPage() {
	const navigate = useNavigate();
	const [loginValue, setLoginValue] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(event: React.SubmitEvent) {
		event.preventDefault();
		setError("");
		try {
			const data = {
				login: loginValue,
				email: emailValue,
				password: password
			};
			const res = await register(data);
			navigate("/login", {
				state: { message: res.message }
			});
		} catch (error) {
			setError(error instanceof Error ? error.message : "Ошибка регистрации");
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>Регистрация</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} placeholder="login" />
			<input value={emailValue} onChange={(e) => setEmailValue(e.target.value)} placeholder="email" />
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button type="submit">Зарегистрироваться</button>
			<Link to="/login">Войти</Link>
		</form>
	)
}