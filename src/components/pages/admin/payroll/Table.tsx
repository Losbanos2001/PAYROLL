import CreateBtn from './CreateBtn';
import THeaders from './THeaders';
import TRows from './TRows';
import TFooter from './TFooter';
import DeleteModal from './modals/DeleteModal';
import EditForm from './modals/EditForm';
import { useState } from 'react';

export function Table() {
	const [editModalState, setEditFormState] = useState(false)
	const [removeModalState, setRemoveModalState] = useState(false)

	const handleUpdateClose = () => {
		setEditFormState(false);
	}

	const handleRemoveClose = () => {
		setRemoveModalState(false);
	}

	return (
		<>
			<EditForm isOpen={editModalState} onClose={handleUpdateClose} />
			<DeleteModal isOpen={removeModalState} onClose={handleRemoveClose} />
			<div className='px-8 py-6 mt-6 space-y-7 w-full max-w-5xl bg-white rounded outline outline-1 outline-slate-300'>
				<div className="flex justify-end">
					<CreateBtn />
				</div>
				<div className="overflow-y-auto max-h-56">
					<table className="w-full table-auto">
					    <thead className="sticky top-0 z-10 text-sm whitespace-nowrap">
					        <tr className="bg-white border-b-2">
								<THeaders setRemoveModalState={setRemoveModalState} />
							</tr>
						</thead>
						<tbody>
							<TRows
								setEditFormState={setEditFormState}
								setRemoveModalState={setRemoveModalState}
							/>
						</tbody>
					</table>
				</div>
				<TFooter />
			</div>
		</>
	);
}