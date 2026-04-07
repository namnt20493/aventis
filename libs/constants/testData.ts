import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";
import { getPoolUser, sozialMitarbeiterPool } from "@constants/credentials";

export type { TestPerson, TestPersonSet } from "@utils/TestDataFactory";

export const Birthdays = {
    ADULT_1: "01.01.1980",
    ADULT_2: "01.01.1982",
    KID_1: "01.01.2015",
    KID_2: "01.01.2018"
} as const;

/**
 * @deprecated Use TestDataFactory.createPersons(seed) or the testPersons fixture.
 * Static persons cause database index hotspots — thousands of records share "FamilyName1".
 * Kept only for backward compatibility during migration.
 */
export const TestPersons = {
    FIRST_PERSON: {
        name: "FamilyName1",
        vorname: "FirstName1",
        fullName: "FamilyName1, FirstName1"
    },
    SECOND_PERSON: {
        name: "FamilyName1",
        vorname: "FirstName2",
        fullName: "FamilyName1, FirstName2"
    },
    THIRD_PERSON: {
        name: "FamilyName1",
        vorname: "FirstName3",
        fullName: "FamilyName1, FirstName3"
    },
    FOURTH_PERSON: {
        name: "FamilyName1",
        vorname: "FirstName4",
        fullName: "FamilyName1, FirstName4"
    },
    // Household members for Häusliche Gewalt tests (4 person household)
    ADULT_WOMAN: {
        name: "FamilyName1",
        vorname: "Mia",
        fullName: "FamilyName1, Mia",
        geburtsdatum: "09.08.1975"
    },
    CHILD_BOY: {
        name: "FamilyName1",
        vorname: "Matteo",
        fullName: "FamilyName1, Matteo",
        geburtsdatum: "11.02.2008"
    },
    CHILD_GIRL: {
        name: "FamilyName1",
        vorname: "Nora",
        fullName: "FamilyName1, Nora",
        geburtsdatum: "12.04.2013"
    }
} as const;

export const TestCompanies = {
    BKW: "BKW Energie AG",
    AGRISANO: "Agrisano Krankenkasse AG",
    AMT_JUSTIZVOLLZUG: "Amt Für Justizvollzug",
    ASSOCIATION_TRANSIT: "Association le Transit",
    ARCOSANA: "Arcosana AG",
    GRABER_IMMOBILIEN: "Graber Immobilien",
    INKASSODIENST: "Inkassodienst"
} as const;

export const TestMitarbeiter = {
    get SOZIALARBEITERIN() { return getPoolUser(sozialMitarbeiterPool).displayName; },
    SOZIALARBEITERIN_1A: "Bern Sozialarbeiterin 1A",
    ADRIAN_MESSERLI: "Adrian Messerli",
    SACHBEARBEITERIN_BERN: "Bern Sachbearbeiterin"
};

export const TestBuchhaltung = {
    REGIONALER_SOZIALDIENST_BERN: "Regionaler Sozialdienst Bern"
} as const;

export const HaushaltsEreignis = {
    EHESCHLIESSUNG: "Eheschliessung",
    GEBURT: "Geburt"
} as const;

export const InHaushalt = {
    UEBERNEHMEN: "Übernehmen"
} as const;

export function createTestPersons(seed: string): TestPersonSet {
    return TestDataFactory.createPersons(seed);
}
