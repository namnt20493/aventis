# Dossier Logic Refactoring

Die `sharedTestLogicDossier.ts` Datei wurde in logische Module aufgeteilt für bessere Wartbarkeit:

## Neue Struktur

### 1. Utility Functions

📁 `libs/utils/testDataUtilities.ts`

- `generateTestcaseSeed()` - Generiert UUID Seeds
- `generateUniqueDossierId()` - Erstellt eindeutige Dossier IDs
- `seedToHash()` - Konvertiert Seeds zu Hash-Strings
- `formatBirthdayToISO()` - Formatiert Geburtstage für API

### 2. GUI Workflows

📁 `libs/workflows/guiDossierWorkflow.ts`

- `generateDossier()` - Vollständige GUI-basierte Dossier-Erstellung

### 3. API Workflows

📁 `libs/workflows/apiDossierWorkflow.ts`

- `generateDossierViaApi()` - API-basierte Dossier-Erstellung
- `generateDossierViaApiWithPerson()` - API mit PersonID-Rückgabe
- `createDossierViaApiOnly()` - Reine API-Erstellung ohne Login
- Re-exports aller API-Funktionen aus `apiSetup`

### 4. Payment Connection Workflows

📁 `libs/workflows/paymentConnectionWorkflow.ts`

- `addZahlungsVerbindung()` - Payment Connection Approval Workflow
- `createDossierViaApiOnlyWithPaymentConnection()` - Vollständiger Payment Workflow

### 5. Index File

📁 `libs/workflows/index.ts`

- Zentrale Sammlung aller Exports für saubere Imports

## Migration

### Bestehende Tests

Alle bestehenden Tests funktionieren weiter, da die ursprüngliche Datei als Re-Export-Sammlung fungiert:

```typescript
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
```

### Neue Tests (Empfohlen)

Für neue Tests, verwenden Sie die modularen Imports:

```typescript
import {
  createDossierViaApiOnlyWithPaymentConnection,
  generateUniqueDossierId,
} from "@workflows";
// oder spezifisch:
import { createDossierViaApiOnlyWithPaymentConnection } from "@workflows/paymentConnectionWorkflow";
import { generateUniqueDossierId } from "@utils/testDataUtilities";
```

## Vorteile

✅ **Bessere Wartbarkeit** - Kleinere, fokussierte Module  
✅ **Klare Trennung** - GUI vs API vs Payment Workflows  
✅ **Rückwärtskompatibilität** - Bestehende Tests funktionieren weiter  
✅ **Bessere Typisierung** - Klare Interface-Definitionen  
✅ **Einfachere Navigation** - Logisch gruppierte Funktionen
