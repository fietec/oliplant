export function addDays(date, days){
	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + days);
	return newDate;
}

export function dateStringToDate(dateStr){
	const [day, month, year] = dateStr.split(".").map(Number);

	return new Date(year, month - 1, day);
}

export function dateToDateString(date) {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
}
