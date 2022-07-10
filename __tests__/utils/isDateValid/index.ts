function isDateValid(date: Date): boolean {
	return date instanceof Date && date.toString() !== 'Invalid Date';
}

export default isDateValid;
