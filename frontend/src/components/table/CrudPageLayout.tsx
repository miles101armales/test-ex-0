import type { ReactNode } from 'react';

type CrudPageLayoutProps = {
	title: string;
	error?: string;
	form?: ReactNode;
	children: ReactNode;
};

export function CrudPageLayout({ title, error, form, children }: CrudPageLayoutProps) {
	return (
		<div>
			<h1>{title}</h1>
			{error && <p className="text-red-600">{error}</p>}
			{form}
			{children}
		</div>
	);
}
