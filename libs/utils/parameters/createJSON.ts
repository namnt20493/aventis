import * as fs from "fs";
import { randomInt } from "crypto";
import * as dotenv from "dotenv";
import { de, de_CH, Faker } from "@faker-js/faker";

dotenv.config();
function absoluteRemainder(value: number, divisor: number): number {
    const remainder = value % divisor;
    return Math.abs(remainder);
}

function IBANgenerator() {
    const countryCode: string = "CH";
    const countryCodeNumeric: string = "1217";

    const blz: number = 789;

    const blzRemainder: number = absoluteRemainder(blz, 97);
    const konto: number = 100000000000 + Math.floor(Math.random() * (99999 - 19000 + 1) + 19000);
    const temp: number = blzRemainder * 1000000000000 + konto;
    const tempRemainder: number = absoluteRemainder(temp, 97);
    const tempRemainderPadded: number = tempRemainder * 1000000 + parseInt(countryCodeNumeric + "00");
    let checkDigits: number = 98 - absoluteRemainder(tempRemainderPadded, 97);
    const checkDigitsStr: string = checkDigits.toString().padStart(2, "0");
    const blzStr: string = blz.toString().padStart(5, "0");
    const iban: string = `${countryCode}${checkDigitsStr}${blzStr}${konto}`;
    return iban;
}

// AHV generation
function generateAHVNumber(): string {
    const countryCode = "756";
    const personalID = Math.floor(Math.random() * 900000000 + 100000000).toString();
    const first12Digits = countryCode + personalID;

    let sum = 0;
    let weight = 3;
    for (let i = first12Digits.length - 1; i >= 0; i--) {
        const num = parseInt(first12Digits.charAt(i), 10);
        sum += num * weight;
        weight = weight === 3 ? 1 : 3;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return first12Digits + checkDigit.toString();
}

// Helper functions
function getRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 1));
}

function formatDate(date: Date): string {
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

function pad(number: number): string {
    return number < 10 ? `0${number}` : number.toString();
}

function randBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dayTodayDate(): string {
    const today = new Date();
    return formatDate(today);
}
function endOfMonthDate(): string {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return formatDate(lastDayOfMonth);
}
function endOfYearDate(): string {
    const today = new Date();
    const lastDayOfYear = new Date(today.getFullYear(), 12, 0);
    return formatDate(lastDayOfYear);
}
function endOfNextYearDate(): string {
    const today = new Date();
    const lastDayOfNextYear = new Date(today.getFullYear() + 1, 12, 0);
    return formatDate(lastDayOfNextYear);
}
function thisMonthName00(): Record<string, string> {
    const start = new Date();
    const monateDeutsch = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    const result: Record<string, string> = {};
    for (let i = 0; i < 12; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const name = monateDeutsch[d.getMonth()];
        const yyyy = d.getFullYear();
        const key = `thisMonthName${i.toString().padStart(2, "0")}`;
        result[key] = `${name} ${yyyy}`;
    }
    return result;
}

// Date generation functions
function getRandomBirthday(fromAge: number, toAge: number): string {
    const today = new Date();
    const year = today.getFullYear() - getRandomNumber(toAge - fromAge + 1) - fromAge;
    const month = getRandomNumber(11);
    const day = getRandomNumber(new Date(year, month + 1, 0).getDate());
    return formatDate(new Date(year, month, day));
}

function createJsonContent(): any {
    const jsonContent: any = {};
    const dossiers: any = {};
    const families: any = {};
    const men: any = {};
    const women: any = {};
    const girls: any = {};
    const birthdaysAdult: any = {};
    const birthdaysKid: any = {};
    const birthdaysBaby: any = {};
    const ahvNumbers: any = {};
    const IBANNumbers: any = {};
    const timeout: any = {};
    const currentDateTime = new Date();
    const formattedDate = `${currentDateTime.getFullYear()}.${currentDateTime.getMonth() + 1}.${currentDateTime.getDate()}`;
    const formattedTime = `${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`;
    const formattedTimestamp = `${formattedDate}|${formattedTime}`;
    const number = "079";
    const email = "abc@gmail.com";

    jsonContent["Mobile"] = `${number}${randBetween(5234500, 5699999)}`;
    jsonContent["PrivateMobile"] = `${number}${randBetween(5234500, 5699999)}`;
    jsonContent["Email"] = `${randBetween(1111, 9999)}${email}`;
    jsonContent["aventisURL"] = process.env.BASE_URL?.replace(/\/$/, "") || "https://qa.aventis.swiss";
    jsonContent["local"] = "http://localhost";
    jsonContent["dayTodayDate"] = dayTodayDate();
    jsonContent["endOfMonthDate"] = endOfMonthDate();
    jsonContent["endOfYearDate"] = endOfYearDate();
    jsonContent["endOfNextYearDate"] = endOfNextYearDate();
    const monthNamesDe = thisMonthName00();
    Object.assign(jsonContent, monthNamesDe);

    // Generate 200 AHV numbers
    for (let i = 0; i < 400; i++) {
        const suffix = (i + 1).toString().padStart(2, "");
        ahvNumbers[`AHVNumber${suffix}`] = generateAHVNumber();
    }
    for (let i = 0; i < 100; i++) {
        const suffix = (i + 1).toString().padStart(2, "");
        IBANNumbers[`IBAN${suffix}`] = IBANgenerator();
    }

    // Generate 100 adult birthdays
    for (let i = 0; i < 100; i++) {
        const suffix = (i + 1).toString().padStart(2, "");
        birthdaysAdult[`BirthdayAdult${suffix}`] = getRandomBirthday(19, 64);
    }

    const dailySeed = Math.floor(Date.now() / 86400000);

    for (let i = 0; i < 100; i++) {
        const suffix = (i + 1).toString().padStart(2, "");
        const random_number = randomInt(1, 1001);
        const combinedValue = `${suffix}_E2E_${formattedTimestamp}_${random_number}`;

        const faker = new Faker({ locale: [de_CH, de] });
        faker.seed(dailySeed + i);

        dossiers[`DossierName${suffix}`] = `${combinedValue}`;
        families[`FamilyName${suffix}`] = faker.person.lastName();
        men[`ManFirstName${suffix}`] = faker.person.firstName("male");
        girls[`GirlFirstName${suffix}`] = faker.person.firstName("female");
        women[`WomanFirstName${suffix}`] = faker.person.firstName("female");
        birthdaysKid[`BirthdayKid${suffix}`] = getRandomBirthday(6, 17);
        birthdaysBaby[`BirthdayBaby${suffix}`] = getRandomBirthday(0, 5);
    }
    const timeoutValues = [10000, 20000, 30000, 60000];
    for (let i = 0; i < timeoutValues.length; i++) {
        const suffix = (i + 1).toString().padStart(2, "");
        timeout[`timeout${suffix}`] = timeoutValues[i];
    }

    // Assemble sections in the desired order
    Object.assign(jsonContent, timeout, dossiers, families, men, girls, women, birthdaysAdult, birthdaysKid, birthdaysBaby, ahvNumbers, IBANNumbers);

    return jsonContent;
}

function createAndSaveJson(filePath: fs.PathOrFileDescriptor, content: any): void {
    fs.writeFile(filePath, JSON.stringify(content, null, 4), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("JSON file has been created and saved successfully.");
        }
    });
}

const jsonContent = createJsonContent();
createAndSaveJson("./parameter.json", jsonContent);
