import type { ReactNode } from 'react';
import { Table, TableEmpty } from './Table';

export type Column<T> = {
	id: string;
	header: string;
	cell: (item: T, ctx: { isEditing: boolean }) => ReactNode;
};

type DataTableProps<T> = {
	data: T[];
	columns: Column<T>[];
	getRowKey: (item: T) => string | number;
	loading?: boolean;
	isEditing?: (item: T) => boolean;
	actions?: (item: T, ctx: { isEditing: boolean }) => ReactNode;
	emptyMessage?: string;
};

const cellClassName = 'border border-gray-200 px-3 py-2';

export function DataTable<T>({
	data,
	columns,
	getRowKey,
	loading,
	isEditing = () => false,
	actions,
	emptyMessage,
}: DataTableProps<T>) {
	const colCount = columns.length + (actions ? 1 : 0);

	return (
		<Table loading={loading}>
			<thead>
				<tr>
					{columns.map((col) => (
						<th key={col.id} className={`${cellClassName} font-medium`}>
							{col.header}
						</th>
					))}
					{actions && <th className={cellClassName} />}
				</tr>
			</thead>
			<tbody>
				{data.length === 0 ? (
					<TableEmpty colSpan={colCount} message={emptyMessage} />
				) : (
					data.map((item) => {
						const editing = isEditing(item);
						return (
							<tr key={getRowKey(item)}>
								{columns.map((col) => (
									<td key={col.id} className={cellClassName}>
										{col.cell(item, { isEditing: editing })}
									</td>
								))}
								{actions && (
									<td className={cellClassName}>
										{actions(item, { isEditing: editing })}
									</td>
								)}
							</tr>
						);
					})
				)}
			</tbody>
		</Table>
	);
}
