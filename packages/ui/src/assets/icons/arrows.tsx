export const IconArrowMoveDownRight = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg {...props} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
			<g fill="currentColor">
				<path
					d="M15.25,9.75H4.75c-1.105,0-2-.895-2-2V3.75"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
				<polyline
					fill="none"
					points="11 5.5 15.25 9.75 11 14"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
			</g>
		</svg>
	);
};

export const IconDiamondArrowRight = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg {...props} height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
			<g fill="currentColor">
				<polyline
					fill="none"
					points="10 6.5 12.25 8.75 10 11"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
				<path
					d="M12.25,8.75h-3.5c-1.105,0-2,.895-2,2v.5"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
				<rect
					fill="none"
					height="11.313"
					rx="2"
					ry="2"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					transform="translate(21.728 9) rotate(135)"
					width="11.313"
					x="3.343"
					y="3.343"
				/>
			</g>
		</svg>
	);
};
