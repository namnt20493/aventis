# Test Tag Validation

## Übersicht

Automatische Validierung von Test-Tags in verschiedenen Test-Verzeichnissen als pre-commit Hook.

## Tag-Anforderungen

| Verzeichnis | Erforderliches Tag | Beispiel |
|-------------|-------------------|----------|
| `staticTestcases/Keywordvalidation/` | `@KeywordValidation` | `@keywordValidation` oder `@KeywordValidation` |
| `staticTestcases/Journey/` | `@journey` | `@journey` |
| `staticTestcases/FunctionalUI/` | `@functionalUI` | `@functionalUI` |
| `staticTestcases/Acceptance/` | `@acceptance` | `@acceptance` |

**Hinweis:** Die Validierung ist case-insensitive, d.h. `@keywordvalidation` und `@KeywordValidation` werden beide akzeptiert.

## Verwendung

### Automatische Validierung (pre-commit Hook)

Der Hook läuft automatisch vor jedem Commit:

```bash
git add .
git commit -m "Your message"
# ✅ Tag-Validierung läuft automatisch
# ✅ Typecheck läuft automatisch
```

Wenn Tags fehlen, wird der Commit blockiert mit einer Fehlermeldung:

```
❌ Test tag validation failed!

The following test files are missing required tags:

📁 Keyword Validation tests (staticTestcases/Keywordvalidation)
   Required tag: @KeywordValidation

   - staticTestcases/Keywordvalidation/Dossier/DO01_NewTest.spec.ts
   - staticTestcases/Keywordvalidation/Klient/KL01_NewTest.spec.ts
```

### Manuelle Validierung

```bash
npm run validate-tags
```

## Test-Tag Syntax

Tags werden im `test()`-Aufruf als Array definiert:

```typescript
test(
    "TestName",
    {
        tag: ["@[183873]", "@keywordValidation", "@all"]
    },
    async ({ page, testData }) => {
        // Test implementation
    }
);
```

### Beispiele

**Keyword Validation Test:**
```typescript
test(
    "DO01_NewDossier",
    {
        tag: ["@[123456]", "@keywordValidation", "@dossier", "@all"]
    },
    async ({ page, testData }) => { ... }
);
```

**Journey Test:**
```typescript
test(
    "DossierKomplett",
    {
        tag: ["@[183873]", "@journey"]
    },
    async ({ page, testData }) => { ... }
);
```

**Functional UI Test:**
```typescript
test(
    "NavigationPage_MenuNavigation",
    {
        tag: ["@[183690]", "@functionalUI"]
    },
    async ({ page }) => { ... }
);
```

**Acceptance Test:**
```typescript
test(
    "AT_Rahmenbudget_Spalten_Ein_Ausblenden",
    {
        tag: ["@[112373]", "@acceptance", "@rahmenbudget", "@all"]
    },
    async ({ page }) => { ... }
);
```

## Hook deaktivieren (nicht empfohlen)

Falls der Hook temporär deaktiviert werden muss:

```bash
git commit -m "Your message" --no-verify
```

⚠️ **Warnung:** Bitte nur in Ausnahmefällen verwenden. Fehlende Tags führen dazu, dass Tests in CI/CD nicht korrekt ausgeführt werden.

## Troubleshooting

### Hook läuft nicht

1. Prüfen ob Husky installiert ist:
   ```bash
   npm run prepare
   ```

2. Prüfen ob `.husky/pre-commit` existiert und ausführbar ist

### Falsche Tag-Erkennung

Das Script sucht nach diesem Pattern:
```typescript
tag: ["...", "..."]
```

Stelle sicher, dass:
- Das `tag`-Array korrekt formatiert ist
- Die Tags in Anführungszeichen stehen (`"@tag"` oder `'@tag'`)
- Keine Syntax-Fehler in der Datei vorhanden sind

## Implementation Details

- **Script:** `libs/utils/validate-test-tags.ts`
- **Hook:** `.husky/pre-commit`
- **npm script:** `npm run validate-tags`
- **Case-insensitive:** Ja (z.B. `@KeywordValidation` = `@keywordvalidation`)
