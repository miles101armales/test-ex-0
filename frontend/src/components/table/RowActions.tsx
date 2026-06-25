type RowActionsProps = {
	isEditing: boolean;
	onEdit: () => void;
	onDelete: () => void;
	onSave: () => void;
	onCancel: () => void;
};

const buttonClassName = 'mr-2 rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200';

export function RowActions({ isEditing, onEdit, onDelete, onSave, onCancel }: RowActionsProps) {
	if (isEditing) {
		return (
			<>
				<button type="button" className={buttonClassName} onClick={onSave}>
					Сохранить
				</button>
				<button type="button" className={buttonClassName} onClick={onCancel}>
					Отмена
				</button>
			</>
		);
	}

	return (
		<>
			<button type="button" className={buttonClassName} onClick={onEdit}>
				Изменить
			</button>
			<button type="button" className={buttonClassName} onClick={onDelete}>
				Удалить
			</button>
		</>
	);
}
