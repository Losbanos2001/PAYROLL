import React, { FC } from 'react'

export const SendEmailTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-48 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-24 -right-9">
				<p className="text-xs font-normal text-left">
					Click this to send registration link via email to employee.
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
					Click this to re-send registration link via email to employee.
				</p>
				<div className="absolute w-3 h-3 bg-[#344960] transform rotate-45 -left-1 bottom-7"></div>
			</span>
		</>
	)
}

export const ResetPassTooltip = () => {
	return (
		<>
			<span className="absolute z-10 w-32 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-24 -right-3.5">
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
			<span className="absolute z-10 w-36 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-14 -right-4">
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
			<span className="absolute z-10 w-36 scale-0 rounded-lg bg-[#344960] p-4 text-xs text-white group-hover:scale-100 flex -top-14 -right-12">
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