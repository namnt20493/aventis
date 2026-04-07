/**
 * Index file for all dossier-related workflows
 * This provides a clean interface to all dossier functionality
 */

// Utility functions
export { generateTestcaseSeed, generateUniqueDossierId, seedToHash, formatBirthdayToISO } from "../utils/testDataUtilities";

// GUI workflows
export { generateDossier } from "../workflows/guiDossierWorkflow";

// API workflows
export { generateDossierViaApiWithPerson, generateDossierViaApi, createDossierViaApiOnly, createDossierViaApi, quickCreateDossier, createErwerbssituationViaApi, createWshLeistungViaApi, createBedarfspruefungViaApi, setBewilligungsworkflowStepViaApi } from "../workflows/apiDossierWorkflow";

export type { GenerateDossierResult, CreateBedarfspruefungOptions, CreateBedarfspruefungResult, CreateErwerbssituationOptions } from "../workflows/apiDossierWorkflow";

// Payment workflows
export { addZahlungsVerbindung, createDossierViaApiOnlyWithPaymentConnection } from "../workflows/paymentConnectionWorkflow";
