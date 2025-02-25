import ReactDOM from 'react-dom';
import classNames from '@/helpers/classNames';

interface FormTooltipProps {
	id: string;
	type: string;
	action: 'default' | 'selectAll' | 'deselectAll';
	tooltipVisible: string | null;
}

export const SendEmailTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-48 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-16 -right-9">
				<p className="text-xs font-normal text-left">
					Click this to send credentials via email to user.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 left-20 -bottom-1.5"></div>
			</span>
		</>
	);
}

export const ResendEmailTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-32 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-12 -right-32">
				<p className="text-xs font-normal text-left">
					Click this to re-send credentials via email to user.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -left-1 bottom-7"></div>
			</span>
		</>
	)
}

export const ResetPassTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-32 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-[70px] -right-3.5">
				<p className="text-xs font-normal text-left">
					Click this button to reset password.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -bottom-1.5 left-24"></div>
			</span>
		</>
	);
}

export const DeleteTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-36 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-16 -right-4">
				<p className="text-xs font-normal text-left">
					Click this button to delete.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -bottom-1.5 left-28"></div>
			</span>
		</>
	)
}

export const EditTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-36 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-[60px] -right-12">
				<p className="text-xs font-normal text-left">
					Click this button to edit.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -bottom-1.5 left-16"></div>
			</span>
		</>
	)
}

export const ResetSignInTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-32 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-12 -left-32">
				<p className="text-xs font-normal text-left">
					Click this button to reset Sign In Attempts.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 bottom-4 -right-1"></div>
			</span>
		</>
	);
}

export const HeaderTooltip = ({ text }: { text: string }) => {
	return (
		<>
			<span className="absolute z-10 w-48 -top-2 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -right-36">
				<p className="text-xs font-normal text-left">
					{text}
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 top-6 -left-1.5"></div>
			</span>
		</>
	);
}

export const FormTooltip = ({ id, type, action, tooltipVisible }: FormTooltipProps) => {
	const text = () => {
		const typeText = type === 'rate_status' ? 'rate status' : type + 's';
		switch (action) {
			case 'default':
				return `If you have not selected any ${type}, by default, ALL ${typeText} will be selected.`;
			case 'selectAll':
				return `Click Select All if you want to select ALL ${typeText}.`;
			case 'deselectAll':
				return `Click Deselect All if you want to deselect ALL ${typeText}.`;
			default:
				return "";
		}
	}

	const labelElement = document.getElementById(id);
	if (!labelElement) return null;
	const rect = labelElement.getBoundingClientRect(); // Get the position of the label element relative to the viewport

	return ReactDOM.createPortal(
		<div id={`${id}-tooltip`} role="tooltip" 
			className={classNames('fixed z-50 w-64 rounded-lg bg-[#344960] p-4 text-xs text-white flex top-px -mt-4 -ml-64', tooltipVisible === id ? 'block' : 'hidden')}
			style={{ top: `${rect.top}px`, left: `${rect.left}px` }}>
			<p className="text-xs font-normal text-left">
				{text()}
			</p>
			<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 top-7 -right-0.5"></div>
		</div>,
		document.body
	)
}