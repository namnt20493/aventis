import { de, de_CH, Faker } from "@faker-js/faker";
import { seedToHash } from "./testDataUtilities";
import * as DateHelper from "@utils/helpers/DateHelper";

function createSeededFaker(seed: string): Faker {
    const faker = new Faker({ locale: [de_CH, de] });
    const numericSeed = parseInt(seedToHash(seed), 36);
    faker.seed(numericSeed);
    return faker;
}

export interface TestPerson {
    name: string;
    vorname: string;
    fullName: string;
    geburtsdatum?: string;
}

export interface TestPersonSet {
    FIRST_PERSON: TestPerson;
    SECOND_PERSON: TestPerson;
    THIRD_PERSON: TestPerson;
    FOURTH_PERSON: TestPerson;
    ADULT_WOMAN: TestPerson;
    CHILD_BOY: TestPerson;
    CHILD_GIRL: TestPerson;
}

export interface ApiPersonData {
    vorname: string;
    nachname: string;
    geburtsdatum?: string;
    geschlecht?: string;
}

export class TestDataFactory {
    static createPersons(seed: string): TestPersonSet {
        const faker = createSeededFaker(seed);
        const familyName = faker.person.lastName();

        const maleFirst1 = faker.person.firstName("male");
        const femaleFirst1 = faker.person.firstName("female");
        const femaleFirst2 = faker.person.firstName("female");
        const maleFirst2 = faker.person.firstName("male");
        const adultWomanName = faker.person.firstName("female");
        const boyName = faker.person.firstName("male");
        const girlName = faker.person.firstName("female");

        return {
            FIRST_PERSON: {
                name: familyName,
                vorname: maleFirst1,
                fullName: `${familyName}, ${maleFirst1}`
            },
            SECOND_PERSON: {
                name: familyName,
                vorname: femaleFirst1,
                fullName: `${familyName}, ${femaleFirst1}`
            },
            THIRD_PERSON: {
                name: familyName,
                vorname: femaleFirst2,
                fullName: `${familyName}, ${femaleFirst2}`
            },
            FOURTH_PERSON: {
                name: familyName,
                vorname: maleFirst2,
                fullName: `${familyName}, ${maleFirst2}`
            },
            ADULT_WOMAN: {
                name: familyName,
                vorname: adultWomanName,
                fullName: `${familyName}, ${adultWomanName}`,
                geburtsdatum: DateHelper.getBirthdateForAge(50)
            },
            CHILD_BOY: {
                name: familyName,
                vorname: boyName,
                fullName: `${familyName}, ${boyName}`,
                geburtsdatum: DateHelper.getBirthdateForAge(18)
            },
            CHILD_GIRL: {
                name: familyName,
                vorname: girlName,
                fullName: `${familyName}, ${girlName}`,
                geburtsdatum: DateHelper.getBirthdateForAge(13)
            }
        };
    }

    static createApiPersonData(seed: string, slot: "first" | "second" = "first"): ApiPersonData {
        const fakerFirst = createSeededFaker(seed + "-first");
        const fakerSecond = createSeededFaker(seed + "-second");
        const nachname = createSeededFaker(seed).person.lastName();

        const targetFaker = slot === "first" ? fakerFirst : fakerSecond;
        const vorname = targetFaker.person.firstName();
        const geschlecht = slot === "first" ? "Maennlich" : "Weiblich";

        return { vorname, nachname, geschlecht };
    }

    static createFamilyName(seed: string): string {
        const faker = createSeededFaker(seed);
        return faker.person.lastName();
    }
}
