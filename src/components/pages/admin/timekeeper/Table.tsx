import SearchBar from './SearchBar';
import CreateBtn from './CreateBtn';
import THeaders from './THeaders';
import TRows from './TRows';
import TFooter from './TFooter';
import DynamicConfirmModal from './modals/DynamicConfirmModal';
import DeleteModal from './modals/DeleteModal';
import EditForm from './modals/EditForm';
import { AccountContext } from '../../../contexts';
import { useContext, useState } from 'react';

export function Table() {
	const { setSendState, sendState } = useContext(AccountContext);
	const [editModalState, setEditFormState] = useState(false)
	const [removeModalState, setRemoveModalState] = useState(false)

	const handleSendClose = () => {
		setSendState((prevState) => ({
			...prevState,
			isOpen: false,
			account: { id: 0, username: "", email: "" },
			type: ""
		}));
	};

	const handleUpdateClose = () => {
		setEditFormState(false);
	}

	const handleRemoveClose = () => {
		setRemoveModalState(false);
	}

	return (
		<>
			<DynamicConfirmModal
				isOpen={sendState.isOpen}
				onClose={handleSendClose}
			/>
			<EditForm isOpen={editModalState} onClose={handleUpdateClose} />
			<DeleteModal isOpen={removeModalState} onClose={handleRemoveClose} />
			<div className="px-8 py-6 space-y-7 bg-white rounded outline outline-1 outline-slate-300">
				<div className="flex justify-between">
					<SearchBar />
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