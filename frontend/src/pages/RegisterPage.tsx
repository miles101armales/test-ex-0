import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { btnPrimary, formClass, inputClass } from '../App';
import { register } from '../api/auth';

export function RegisterPage() {
	const navigate = useNavigate();
	const [loginValue, setLoginValue] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
		<form onSubmit={handleSubmit} className={formClass}>
			<h1>Регистрация</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<input value={loginValue} onChange={(e) => setLoginValue(e.target.value)} className={inputClass} placeholder="login" />
			<input value={emailValue} onChange={(e) => setEmailValue(e.target.value)} className={inputClass} placeholder="email" />
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
			<button type="submit" className={btnPrimary}>Зарегистрироваться</button>
			<Link to="/login">Войти</Link>
		</form>
	)
}