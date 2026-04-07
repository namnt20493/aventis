/**
 * API-based test setup utilities
 * Creates test data via API calls instead of GUI for faster test execution
 */

import { APIRequestContext, Page } from "@playwright/test";
import { randomUUID } from "crypto";
import { generateAhvNumber, generateUniqueIban } from "./TestdataGenerator";
import * as DateHelper from "./helpers/DateHelper";
import { TestDataFactory } from "./TestDataFactory";
import { getBackendUrl } from "./url-config";

const SLOW_MODE_SETTLE_MS = 5000;

async function slowModeSettle(): Promise<void> {
    if (process.env.SLOW_MODE === "true") {
        await new Promise((resolve) => setTimeout(resolve, SLOW_MODE_SETTLE_MS));
    }
}

/**
 * Get the API base URL based on the frontend environment
 * Dynamically extracts environment from frontend URL and builds corresponding backend URL
 * Supports localhost via API_BASE_URL environment variable
 */
function getApiBaseUrl(page?: Page): string {
    const frontendUrl = page?.url() || process.env.BASE_URL;
    return getBackendUrl(frontendUrl);
}

// Default IDs for test environment (Bern setup - bern.sozialarbeiterin1a@diartis.ch)
const DEFAULT_CONFIG = {
    teamId_Sozialarbeit: "f02a6e1c-67c6-4139-8c46-8d90c93ab393",
    userId_Sozialarbeit: "bf651462-43b8-4fc4-b99c-29cff119412e",
    teamId_Sachbearbeitung: "e44c673a-c3e0-44e1-af3e-d775c7fcfd9a",
    gemeindeId_Zustaendig: "ff0f24df-31d0-4f9f-8724-ad166e6a8a97",
    // Default PLZ/Ort for Moosseedorf
    defaultPlzOrt: {
        plz: "3302",
        postleitzahlId: "76f1a03c-a1e2-40df-a094-b7eea7d1ab5d",
        ort: "Moosseedorf",
        gemeindeId: "ff0f24df-31d0-4f9f-8724-ad166e6a8a97",
        land: "Schweiz",
        landId: "e9dcc8e3-b809-4aa7-9e9b-d515753877d9"
    }
};

export interface DossierPersonData {
    vorname: string;
    nachname: string;
    geburtsdatum?: string;
    ahvNummer?: string;
    geschlecht?: string | null;
    zivilstand?: string | null;
    mailadresse?: string;
    iban?: string | null;
    strasse?: string;
    hausnummer?: string;
    plz?: string;
    ort?: string;
}

export interface CreateDossierOptions {
    bezeichnung: string;
    person?: Partial<DossierPersonData>;
    secondPerson?: Partial<DossierPersonData>;
    eroeffnungsdatum?: string;
    dossiersprache?: "German" | "French" | "Italian";
}

export interface CreateDossierResult {
    dossierId: string;
    personInDossierId: string;
    secondPersonInDossierId?: string;
    bezeichnung: string;
}

/**
 * Creates a dossier via API call
 * IMPORTANT: The request context must have valid session cookies (user must be logged in via GUI first)
 */
export async function createDossierViaApi(request: APIRequestContext, options: CreateDossierOptions, seed: string, page?: Page): Promise<CreateDossierResult> {
    const persons = TestDataFactory.createPersons(seed);
    const dossierId = randomUUID();
    const personInDossierId = randomUUID();
    const secondPersonInDossierId = options.secondPerson ? randomUUID() : undefined;
    const addressId = randomUUID();
    const secondAddressId = options.secondPerson ? randomUUID() : undefined;

    const personData: DossierPersonData = {
        vorname: persons.FIRST_PERSON.vorname,
        nachname: persons.FIRST_PERSON.name,
        geburtsdatum: "1980-01-01T00:00:00",
        ahvNummer: generateAhvNumber().toString(),
        geschlecht: "Maennlich",
        zivilstand: "Ledig",
        mailadresse: "test@example.com",
        iban: generateUniqueIban(seed).toString(),
        strasse: "Strasse_831",
        hausnummer: "27",
        ...options.person
    };

    const secondPersonData: DossierPersonData | null = options.secondPerson
        ? {
              vorname: persons.SECOND_PERSON.vorname,
              nachname: persons.SECOND_PERSON.name,
              geburtsdatum: "2010-01-01T00:00:00",
              ahvNummer: generateAhvNumber().toString(),
              geschlecht: "Maennlich",
              zivilstand: "Ledig",
              mailadresse: "test2@example.com",
              iban: generateUniqueIban(seed).toString(),
              strasse: "Strasse_831",
              hausnummer: "27",
              ...options.secondPerson
          }
        : null;

    // Format date to ISO if provided in DD.MM.YYYY format
    const eroeffnungsdatum = options.eroeffnungsdatum ? formatDateToISO(options.eroeffnungsdatum) : new Date().toISOString().split("T")[0] + "T00:00:00";

    // Build personen array
    const personen: any[] = [
        {
            personInDossierId_Target: personInDossierId,
            personenregisterId: null,
            vorname: personData.vorname,
            nachname: personData.nachname,
            geschlecht: personData.geschlecht,
            geburtsdatum: personData.geburtsdatum,
            ahvNummer: personData.ahvNummer,
            zivilstand: personData.zivilstand,
            zivilstandSeit: null,
            aufenthaltsstatus: "Aufenthalt",
            aufenthaltsstatusValidFrom: null,
            aufenthaltsstatusValidThrough: null,
            landId_Nationalitaet: null,
            language_Korrespondenz: null,
            iban_Zahlungsverbindung: personData.iban,
            wohnMeldeAdresse: {
                id: addressId,
                zusatz: null,
                strasse: personData.strasse,
                hausnummer: personData.hausnummer,
                plzOrt: DEFAULT_CONFIG.defaultPlzOrt,
                institutionId: null,
                validFrom: null,
                validThrough: null,
                egid: null,
                ewid: null
            },
            aufenthalt: null,
            telefonMobil: "079 5320286",
            telefonPrivat: "079 5462626",
            telefonArbeit: null,
            mailadresse: personData.mailadresse,
            trennung: null,
            typ: "Klient",
            istAntragsstellend: true
        }
    ];

    // Add second person if specified
    if (secondPersonData && secondPersonInDossierId && secondAddressId) {
        personen.push({
            personInDossierId_Target: secondPersonInDossierId,
            personenregisterId: null,
            vorname: secondPersonData.vorname,
            nachname: secondPersonData.nachname,
            geschlecht: secondPersonData.geschlecht,
            geburtsdatum: secondPersonData.geburtsdatum,
            ahvNummer: secondPersonData.ahvNummer,
            zivilstand: secondPersonData.zivilstand,
            zivilstandSeit: null,
            aufenthaltsstatus: "Aufenthalt",
            aufenthaltsstatusValidFrom: null,
            aufenthaltsstatusValidThrough: null,
            landId_Nationalitaet: null,
            language_Korrespondenz: null,
            iban_Zahlungsverbindung: secondPersonData.iban,
            wohnMeldeAdresse: {
                id: secondAddressId,
                zusatz: null,
                strasse: secondPersonData.strasse,
                hausnummer: secondPersonData.hausnummer,
                plzOrt: DEFAULT_CONFIG.defaultPlzOrt,
                institutionId: null,
                validFrom: null,
                validThrough: null,
                egid: null,
                ewid: null
            },
            aufenthalt: null,
            telefonMobil: null,
            telefonPrivat: null,
            telefonArbeit: null,
            mailadresse: secondPersonData.mailadresse,
            trennung: null,
            typ: "Klient",
            istAntragsstellend: false
        });
    }

    const command = {
        dossierId,
        dossiersprache: options.dossiersprache || "German",
        bezeichnung: options.bezeichnung,
        eroeffnungsdatum,
        personen,
        teamId_Sozialarbeit: DEFAULT_CONFIG.teamId_Sozialarbeit,
        userId_Sozialarbeit: null,
        teamId_Sachbearbeitung: DEFAULT_CONFIG.teamId_Sachbearbeitung,
        userId_Sachbearbeitung: null,
        gemeindeId_Zustaendig: DEFAULT_CONFIG.gemeindeId_Zustaendig,
        $type: "CreateDossierCommand"
    };

    const apiBaseUrl = getApiBaseUrl(page);
    const response = await request.post(`${apiBaseUrl}/mediator/CreateDossierCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: command,
        timeout: 60000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`Failed to create dossier via API: ${response.status()} - ${errorText}`);
    }

    console.log(`✅ Dossier created via API: ${options.bezeichnung} (ID: ${dossierId})${secondPersonInDossierId ? " with 2 persons" : ""}`);

    // Remove after
    // https://diartis.visualstudio.com/Aventis/_git/Aventis/pullrequest/18132

    await new Promise((resolve) => setTimeout(resolve, 6000)); // Wait for 6 seconds to ensure backend processes the creation before any further API calls
    await slowModeSettle();

    return {
        dossierId,
        personInDossierId,
        secondPersonInDossierId,
        bezeichnung: options.bezeichnung
    };
}

/**
 * Converts DD.MM.YYYY to ISO format YYYY-MM-DDT00:00:00
 */
function formatDateToISO(dateStr: string): string {
    if (dateStr.includes("T")) return dateStr; // Already ISO

    const parts = dateStr.split(".");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
    }
    return dateStr;
}

/**
 * Quick dossier creation with minimal config
 * Use this in tests that just need a dossier to exist
 */
export async function quickCreateDossier(request: APIRequestContext, seed: string, page?: Page): Promise<CreateDossierResult> {
    const bezeichnung = `KVTest_${seed.substring(0, 8)}`;

    return createDossierViaApi(
        request,
        {
            bezeichnung,
            person: {
                ahvNummer: generateAhvNumber(seed).toString()
            }
        },
        seed,
        page
    );
}

// ============================================================================
// ERWERBSSITUATION API FUNCTIONS
// ============================================================================

export interface CreateErwerbssituationOptions {
    personInDossierId: string;
    typ?: "UnselbstaendigerErwerbslohn" | "Ausbildungslohn" | "AHVErwachsenenrente" | "Arbeitslosenentschaedigung";
    betragMonatlich: number;
    pensumProzent?: number;
    validFrom: string; // ISO format: YYYY-MM-DDT00:00:00
    validThrough: string;
    institutionId?: string; // ID of the paying institution (e.g., employer)
    institutionName?: string; // Display name for the institution
    dreizehnterMonatslohn?: boolean;
}

/**
 * Creates an Erwerbssituation (income situation) via API
 * This replaces the UI step: KL03_ErwerbsituationEinnahmen_Lohn_erfassen
 */
export async function createErwerbssituationViaApi(request: APIRequestContext, options: CreateErwerbssituationOptions, page?: Page): Promise<string> {
    const erwerbssituationId = randomUUID();
    const beruflicheLaufbahnStationId = randomUUID();

    const command = {
        personInDossierId: options.personInDossierId,
        erwerbssituationIdsToDelete: [],
        erwerbssituationenToSave: [
            {
                id: erwerbssituationId,
                typ: options.typ || "UnselbstaendigerErwerbslohn",
                betragMonatlich: options.betragMonatlich,
                pensumProzent: options.pensumProzent || 100,
                ausgesteuertSeit: null,
                dreizehnterMonatslohn: options.dreizehnterMonatslohn ?? true,
                hilflosigkeit: null,
                validFrom: options.validFrom,
                validThrough: options.validThrough,
                bezahler: options.institutionId
                    ? {
                          displayText: options.institutionName || "Arbeitgeber",
                          bezahlerType: "institution",
                          id: options.institutionId,
                          text: options.institutionName || "Arbeitgeber",
                          institutionFachperson: "Institution",
                          rowVersion: null
                      }
                    : null,
                modification: "added",
                dokumente: [],
                beruflicheLaufbahnStationId,
                rowVersion: null,
                fileIds_ToAdd: [],
                fileIds_ToDelete: [],
                personInDossierId_Bezahler: null,
                institutionId_Bezahler: options.institutionId || null
            }
        ],
        $type: "SaveErwerbssituationenCommand"
    };

    const apiBaseUrl = getApiBaseUrl(page);
    const response = await request.post(`${apiBaseUrl}/mediator/SaveErwerbssituationenCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: command,
        timeout: 20000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`SaveErwerbssituationenCommand failed: ${response.status()} - ${errorText}`);
    }

    console.log(`✅ Erwerbssituation created via API (ID: ${erwerbssituationId})`);
    await slowModeSettle();
    return erwerbssituationId;
}

// ============================================================================
// BEDARFSPRÜFUNG API FUNCTIONS
// ============================================================================

export interface CreateBedarfspruefungOptions {
    dossierId: string;
    personInDossierId: string;
    leistungId?: string;
    bedarfspruefungId?: string;
    unterstuetztAb?: string; // ISO format: YYYY-MM-DDT00:00:00
}

export interface CreateBedarfspruefungResult {
    leistungId: string;
    bedarfspruefungId: string;
    leistungsentscheidId: string;
}

/**
 * Creates a WSH-Leistung with Leistungsentscheid via API (simplified version)
 * This creates an active Rahmenbudget without the full Bedarfsprüfung workflow
 *
 * Flow: CreateLeistungWsh -> SaveLeistungsentscheid
 * Note: Bedarfsprüfung/Bewilligungsworkflow is created automatically by backend
 */
export async function createWshLeistungViaApi(request: APIRequestContext, options: CreateBedarfspruefungOptions, page?: Page): Promise<CreateBedarfspruefungResult> {
    const leistungWshId = randomUUID();
    const leistungsentscheidId = randomUUID();

    // Calculate first of current month in ISO format
    const now = new Date();
    const unterstuetztAb = options.unterstuetztAb || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00`;

    // Step 1: Create WSH Leistung
    console.log("  Creating WSH Leistung...");
    const createLeistungWshCommand = {
        dossierId: options.dossierId,
        personenInDossierIds: [options.personInDossierId],
        unterstuetztAb,
        zustaendigeGemeindeId: DEFAULT_CONFIG.gemeindeId_Zustaendig,
        rowVersion: null,
        leistungWshId,
        $type: "CreateLeistungWshCommand"
    };

    const apiBaseUrl = getApiBaseUrl(page);
    let response = await request.post(`${apiBaseUrl}/mediator/CreateLeistungWshCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: createLeistungWshCommand,
        timeout: 60000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`CreateLeistungWshCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ WSH Leistung created");
    await slowModeSettle();

    // Step 2: Save Leistungsentscheid (creates Bewilligungsworkflow automatically)
    console.log("  Saving Leistungsentscheid...");
    const validFrom = new Date().toISOString().split("T")[0];
    const validThrough = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0];

    const saveLeistungsentscheidCommand = {
        leistungId: leistungWshId,
        leistungsentscheidId,
        typ: "Bewilligung",
        ohneAuszahlung: false,
        validFrom,
        validThrough,
        fileIds_ToAdd: [],
        fileIds_ToDelete: [],
        $type: "SaveLeistungsentscheidCommand"
    };

    response = await request.post(`${apiBaseUrl}/mediator/SaveLeistungsentscheidCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: saveLeistungsentscheidCommand
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`SaveLeistungsentscheidCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ Leistungsentscheid saved");
    await slowModeSettle();

    console.log(`✅ WSH-Leistung created via API (LeistungId: ${leistungWshId})`);

    return {
        leistungId: leistungWshId,
        bedarfspruefungId: "", // Not created in this simplified version
        leistungsentscheidId
    };
}

/**
 * Creates a Bedarfsprüfung (needs assessment) via API - FULL VERSION
 * This replaces the UI steps: A01_AnspruchPruefung_Bedarfspruefung
 *
 * NOTE: This requires the user to have "Schreibzugriff für das Modul Beratung"
 * Flow: CreateLeistungWsh -> CreateBedarfspruefung -> UpdateBedarfspruefung -> SaveLeistungsentscheid
 */
export async function createBedarfspruefungViaApi(request: APIRequestContext, options: CreateBedarfspruefungOptions, page?: Page): Promise<CreateBedarfspruefungResult> {
    const leistungWshId = randomUUID();
    const bedarfspruefungId = options.bedarfspruefungId || randomUUID();
    const leistungsentscheidId = randomUUID();

    // Calculate first of current month in ISO format
    const now = new Date();
    const unterstuetztAb = options.unterstuetztAb || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01T00:00:00`;

    // Step 1: Create WSH Leistung first
    console.log("  Creating WSH Leistung...");
    const createLeistungWshCommand = {
        dossierId: options.dossierId,
        personenInDossierIds: [options.personInDossierId],
        unterstuetztAb,
        zustaendigeGemeindeId: DEFAULT_CONFIG.gemeindeId_Zustaendig,
        rowVersion: null,
        leistungWshId,
        $type: "CreateLeistungWshCommand"
    };

    const apiBaseUrl = getApiBaseUrl(page);
    let response = await request.post(`${apiBaseUrl}/mediator/CreateLeistungWshCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: createLeistungWshCommand
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`CreateLeistungWshCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ WSH Leistung created");
    await slowModeSettle();

    // Step 2: Create Bedarfsprüfung linked to the WSH Leistung
    console.log("  Creating Bedarfsprüfung...");
    const createBedarfspruefungCommand = {
        leistungId: leistungWshId,
        bedarfspruefungId,
        $type: "CreateBedarfspruefungCommand"
    };

    response = await request.post(`${apiBaseUrl}/mediator/CreateBedarfspruefungCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: createBedarfspruefungCommand,
        timeout: 60000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`CreateBedarfspruefungCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ Bedarfsprüfung created");
    await slowModeSettle();

    // Step 3: Update Bedarfsprüfung with status
    console.log("  Updating Bedarfsprüfung status...");
    const updateBedarfspruefungCommand = {
        bedarfspruefungId,
        status: "InBearbeitung",
        dokumentChecks: [
            {
                key: 1,
                check: "Pass / Identitätskarte",
                personInDossierId: options.personInDossierId,
                status: "Einzureichen",
                bemerkung: null
            }
        ],
        $type: "UpdateBedarfspruefungCommand"
    };

    response = await request.post(`${apiBaseUrl}/mediator/UpdateBedarfspruefungCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: updateBedarfspruefungCommand
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`UpdateBedarfspruefungCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ Bedarfsprüfung status updated");
    await slowModeSettle();

    // Step 4: Save Leistungsentscheid (creates Bewilligungsworkflow automatically)
    console.log("  Saving Leistungsentscheid...");
    const validFrom = new Date().toISOString().split("T")[0];
    const validThrough = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0];

    const saveLeistungsentscheidCommand = {
        leistungId: leistungWshId,
        leistungsentscheidId,
        typ: "Bewilligung",
        ohneAuszahlung: false,
        validFrom,
        validThrough,
        fileIds_ToAdd: [],
        fileIds_ToDelete: [],
        $type: "SaveLeistungsentscheidCommand"
    };

    response = await request.post(`${apiBaseUrl}/mediator/SaveLeistungsentscheidCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: saveLeistungsentscheidCommand,
        timeout: 60000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`SaveLeistungsentscheidCommand failed: ${response.status()} - ${errorText}`);
    }
    console.log("  ✓ Leistungsentscheid saved");
    await slowModeSettle();

    console.log(`✅ Bedarfsprüfung created via API (LeistungId: ${leistungWshId})`);

    return {
        leistungId: leistungWshId,
        bedarfspruefungId,
        leistungsentscheidId
    };
}

/**
 * Sets a Bewilligungsworkflow step result via API
 * This replaces the UI steps: BW02b_Bewilligungs_Workflow_Step_V2
 */
export async function setBewilligungsworkflowStepViaApi(request: APIRequestContext, bewilligungsworkflowStepId: string, result: "Angefragt" | "Bewilligt" | "Abgelehnt" | "PruefungOk", page?: Page): Promise<void> {
    const command = {
        bewilligungsworkflowStepId,
        result,
        $type: "SetBewilligungsworkflowStepResultCommand"
    };

    const apiBaseUrl = getApiBaseUrl(page);
    const response = await request.post(`${apiBaseUrl}/mediator/SetBewilligungsworkflowStepResultCommand`, {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "de-CH",
            "content-type": "application/json"
        },
        data: command,
        timeout: 60000
    });

    if (!response.ok()) {
        const errorText = await response.text();
        throw new Error(`SetBewilligungsworkflowStepResultCommand failed: ${response.status()} - ${errorText}`);
    }

    console.log(`✅ Bewilligungsworkflow step set to: ${result}`);
    await slowModeSettle();
}
