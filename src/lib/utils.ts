import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const prettifyDate = (date: Date): string => {
	const timeFormatter = new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	const time = timeFormatter.format(date);
	const formattedDate = dateFormatter.format(date);

	return `${time}, ${formattedDate}`;
};

export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};
