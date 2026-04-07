import { TestDataFactory } from "../TestDataFactory";

describe("TestDataFactory", () => {
    it("should generate deterministic names from same seed", () => {
        const persons1 = TestDataFactory.createPersons("test-seed-abc");
        const persons2 = TestDataFactory.createPersons("test-seed-abc");

        expect(persons1.FIRST_PERSON.name).toBe(persons2.FIRST_PERSON.name);
        expect(persons1.FIRST_PERSON.vorname).toBe(persons2.FIRST_PERSON.vorname);
        expect(persons1.SECOND_PERSON.name).toBe(persons2.SECOND_PERSON.name);
    });

    it("should generate different family names for different seeds", () => {
        const results = new Set<string>();
        const seeds = ["seed-aaa", "seed-bbb", "seed-ccc", "seed-ddd", "seed-eee"];
        for (const s of seeds) {
            results.add(TestDataFactory.createPersons(s).FIRST_PERSON.name);
        }
        expect(results.size).toBeGreaterThanOrEqual(3);
    });

    it("should share the same family name within a household", () => {
        const persons = TestDataFactory.createPersons("household-seed");

        expect(persons.FIRST_PERSON.name).toBe(persons.SECOND_PERSON.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.ADULT_WOMAN.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.CHILD_BOY.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.CHILD_GIRL.name);
    });

    it("should build correct fullName format: 'Nachname, Vorname'", () => {
        const persons = TestDataFactory.createPersons("format-seed");

        expect(persons.FIRST_PERSON.fullName).toBe(
            `${persons.FIRST_PERSON.name}, ${persons.FIRST_PERSON.vorname}`
        );
    });

    it("should not contain generic placeholder names", () => {
        const seeds = ["real-1", "real-2", "real-3"];
        for (const s of seeds) {
            const persons = TestDataFactory.createPersons(s);
            expect(persons.FIRST_PERSON.name).not.toMatch(/FamilyName/i);
            expect(persons.FIRST_PERSON.vorname).not.toMatch(/FirstName/i);
        }
    });

    it("should not contain appended numbers in family names", () => {
        const persons = TestDataFactory.createPersons("no-numbers");
        expect(persons.FIRST_PERSON.name).not.toMatch(/\d/);
    });

    it("should generate valid person data for API usage", () => {
        const apiData = TestDataFactory.createApiPersonData("api-seed");

        expect(apiData.vorname).toBeTruthy();
        expect(apiData.nachname).toBeTruthy();
        expect(apiData.nachname).not.toMatch(/FamilyName/i);
        expect(apiData.geschlecht).toBe("Maennlich");
    });

    it("should generate a second person with different first name but same family name", () => {
        const person1 = TestDataFactory.createApiPersonData("multi-seed", "first");
        const person2 = TestDataFactory.createApiPersonData("multi-seed", "second");

        expect(person1.nachname).toBe(person2.nachname);
        expect(person1.vorname).not.toBe(person2.vorname);
    });

    it("should generate unique first names within the same household", () => {
        const persons = TestDataFactory.createPersons("uniqueness-seed");
        const firstNames = [
            persons.FIRST_PERSON.vorname,
            persons.SECOND_PERSON.vorname,
            persons.THIRD_PERSON.vorname,
            persons.FOURTH_PERSON.vorname,
            persons.ADULT_WOMAN.vorname,
            persons.CHILD_BOY.vorname,
            persons.CHILD_GIRL.vorname
        ];
        const uniqueNames = new Set(firstNames);
        expect(uniqueNames.size).toBe(firstNames.length);
    });

    it("should generate dynamic birthdates using DateHelper", () => {
        const persons = TestDataFactory.createPersons("birthdate-seed");

        expect(persons.ADULT_WOMAN.geburtsdatum).toBeTruthy();
        expect(persons.CHILD_BOY.geburtsdatum).toBeTruthy();
        expect(persons.CHILD_GIRL.geburtsdatum).toBeTruthy();

        expect(persons.ADULT_WOMAN.geburtsdatum).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
        expect(persons.CHILD_BOY.geburtsdatum).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
        expect(persons.CHILD_GIRL.geburtsdatum).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    });
});
