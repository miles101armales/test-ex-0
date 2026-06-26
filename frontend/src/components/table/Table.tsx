import type { ReactNode } from 'react';

type TableProps = {
	loading?: boolean;
	children: ReactNode;
};

export function Table({ loading, children }: TableProps) {
	if (loading) return <p>Загрузка...</p>;

	return (
		<table className="w-full border-collapse text-left">
			{children}
		</table>
	);
}

export function TableEmpty({ colSpan, message = 'Нет данных' }: { colSpan: number; message?: string }) {
	return (
		<tr>
			<td colSpan={colSpan} className="border border-gray-200 px-3 py-2 text-gray-500">
				{message}
			</td>
		</tr>
	);
}
