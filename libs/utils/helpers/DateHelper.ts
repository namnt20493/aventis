export function getFirstDayOfTheYearString() {
    const date = new Date();
    const year = date.getFullYear();

    return `01.01.${year}`;
}

export function getTodayDateString(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getTodayWithFutureYearString(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + 360);
    const futureYear = futureDate.getFullYear();

    return `${day}.${month}.${futureYear}`;
}

export function getFirstOfMonthString(): string {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `01.${month}.${year}`;
}

export function getLastDayOfYearString(): string {
    const date = new Date();
    const year = date.getFullYear();

    return `31.12.${year}`;
}

export function getLastDayOfFutureYearString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + 360);
    const futureYear = futureDate.getFullYear();

    return `31.12.${futureYear}`;
}

export function getDaysFutureString(days): string {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getFirstMonthAndYearFromFutureYear(): string {
    const date = new Date();
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + 360);
    const futureYear = futureDate.getFullYear();

    return `01.${futureYear}`;
}

export function getLastMonthAndYearFromFutureYear(): string {
    const date = new Date();
    const futureDate = new Date(date);
    futureDate.setDate(date.getDate() + 360);
    const futureYear = futureDate.getFullYear();

    return `12.${futureYear}`;
}

export function getOneYearAgoString(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export function getOneMonthAgoString(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export function getBirthdateForAge(years: number): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export function getMonthYearAsString(addMonths: number = 0): string {
    const germanMonths = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    const date = new Date();
    date.setMonth(date.getMonth() + addMonths);

    const monthName = germanMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${monthName} ${year}`;
}
