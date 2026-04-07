import { randomUUID } from "crypto";

/**
 * Generates a valid Swiss AHV number
 * @param seed - Optional seed for reproducibility
 * @returns Formatted AHV number (756.XXXX.XXXX.XX)
 */
export function generateAhvNumber(seed?: string): string {
    // Generate or use provided seed
    const actualSeed = seed || randomUUID();

    // Log seed for reproduction
    if (!seed) {
        console.log(`🔑 [AHV] Seed: ${actualSeed}`);
        console.log(`   Reproduce: generateAhvNumber('${actualSeed}')`);
    } else {
        console.log(`🔁 [AHV] Using seed: ${actualSeed}`);
    }

    // Create seeded random generator (replaces Math.random())
    const random = createSeededRandom(actualSeed);

    // Start with fixed prefix [7, 5, 6] + 9 random digits
    // ⚠️ ONLY CHANGE: Math.random() → random()
    const digits = [7, 5, 6, ...Array.from({ length: 9 }, () => Math.floor(random() * 10))];

    // Calculate checksum with alternating weights (1x, 3x, 1x, 3x, ...)
    // ✅ UNCHANGED
    let total = 0;
    for (let i = 0; i < 12; i++) {
        total += i % 2 === 0 ? digits[i] : digits[i] * 3;
    }

    // Calculate check digit
    // ✅ UNCHANGED
    let checkDigit = 0;
    if (total % 10 !== 0) {
        const roundTen = Math.floor(total / 10) * 10 + 10;
        checkDigit = roundTen - total;
    }

    // Build unformatted AHV number
    // ✅ UNCHANGED
    const unformattedAhv = [...digits, checkDigit].join("");

    // Format as 756.XXXX.XXXX.XX
    // ✅ UNCHANGED
    return `${unformattedAhv.slice(0, 3)}.${unformattedAhv.slice(3, 7)}.${unformattedAhv.slice(7, 11)}.${unformattedAhv.slice(11)}`;
}

/**
 * Generates a unique Swiss IBAN for payment connections based on proven working IBAN
 * Uses CH0209000000100013997 as the base template with minimal variations
 * @param seed - Seed for reproducibility and uniqueness
 * @returns Valid Swiss IBAN with working bank code
 */
export function generateUniqueIban(seed: string): string {
    console.log(`🏦 [IBAN] Using seed: ${seed}`);

    // Use the proven working IBAN: CH0209000000100013997
    // Only change the last 3-4 digits to make it unique while keeping the working bank code
    const baseBankCode = "09000";
    const baseAccountPrefix = "00010001";

    const random = createSeededRandom(seed);

    // Generate 4-digit variation from seed for account number suffix
    let accountSuffix = "";
    for (let i = 0; i < 4; i++) {
        accountSuffix += Math.floor(random() * 10).toString();
    }

    // Construct account number: baseAccountPrefix + variation (total 12 digits)
    const accountNumber = baseAccountPrefix + accountSuffix;

    // Calculate check digits for this specific combination
    const checkDigits = calculateIbanCheckDigits("CH", baseBankCode, accountNumber);

    // Construct normalized IBAN
    const normalizedIban = `CH${checkDigits}${baseBankCode}${accountNumber}`;

    // Format with spaces
    const formattedIban = formatIban(normalizedIban);

    console.log(`🏦 [IBAN] Generated: ${formattedIban} (base: CH0209000000100013997, suffix: ${accountSuffix})`);
    return formattedIban;
}

/**
 * Calculates IBAN check digits using ISO 7064 mod 97 algorithm
 * Same logic as the C# IsValidIbanCheckDigit method but in reverse
 */
function calculateIbanCheckDigits(countryCode: string, bankCode: string, accountNumber: string): string {
    // Create IBAN without check digits (use 00 as placeholder)
    const ibanWithoutCheck = `${bankCode}${accountNumber}${countryCode}00`;

    // Convert to integer according to IBAN standard
    const numericString = convertIbanToNumeric(ibanWithoutCheck);

    // Calculate check digits using mod 97
    const remainder = modulo97(numericString);
    const checkDigits = 98 - remainder;

    return checkDigits.toString().padStart(2, "0");
}

/**
 * Converts IBAN string to numeric representation for mod 97 calculation
 * Letters: A=10, B=11, C=12, ..., Z=35
 */
function convertIbanToNumeric(iban: string): string {
    let result = "";

    for (const char of iban.toUpperCase()) {
        if (char >= "0" && char <= "9") {
            result += char;
        } else if (char >= "A" && char <= "Z") {
            // A=10, B=11, ..., Z=35
            result += (char.charCodeAt(0) - "A".charCodeAt(0) + 10).toString();
        }
    }

    return result;
}

/**
 * Calculates modulo 97 for large numbers (handles BigInt-like behavior)
 * Implementation based on the ISO 7064 standard
 */
function modulo97(numericString: string): number {
    let remainder = 0;

    for (const digit of numericString) {
        remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
    }

    return remainder;
}

/**
 * Formats IBAN with spaces: CH12 3456 7890 1234 5678 9
 */
function formatIban(normalizedIban: string): string {
    // Swiss IBAN format: CH12 3456 7890 1234 5678 9
    return `${normalizedIban.slice(0, 4)} ${normalizedIban.slice(4, 8)} ${normalizedIban.slice(8, 12)} ${normalizedIban.slice(12, 16)} ${normalizedIban.slice(16, 20)} ${normalizedIban.slice(20)}`;
}

/**
 * Simple, robust seeded random number generator (LCG algorithm)
 * Returns values between 0 and 1 (like Math.random())
 */
function createSeededRandom(seed: string): () => number {
    // Convert string seed to number (simple hash)
    let state = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        state = (state << 5) - state + char;
        state = state | 0; // Convert to 32-bit integer
    }

    // Ensure positive
    state = Math.abs(state);

    // Linear Congruential Generator
    return function () {
        // LCG parameters (from Numerical Recipes)
        state = (state * 1664525 + 1013904223) | 0;

        // Convert to 0-1 range
        return Math.abs(state) / 2147483647;
    };
}
