// ============================================================================
// CONFIGURATION - Centralized configuration for all separators and patterns
// ============================================================================

interface SeparatorConfig {
    delimiter: string | RegExp;
    priority: number; // Higher priority processed first
    joinWith: string;
    preserveSpacing: boolean;
    captureDelimiter?: boolean; // Capture delimiter in split
}

interface TransformerConfig {
    pattern: RegExp;
    transform: (match: string) => string;
    description: string;
}

const SEPARATOR_CONFIGS: SeparatorConfig[] = [
    {
        delimiter: ";",
        priority: 1,
        joinWith: " ; ",
        preserveSpacing: false,
        captureDelimiter: false
    },
    {
        delimiter: ",",
        priority: 2,
        joinWith: ", ",
        preserveSpacing: false,
        captureDelimiter: false
    },
    {
        delimiter: /(\s*-\s*)/,
        priority: 3,
        joinWith: "",
        preserveSpacing: true,
        captureDelimiter: true
    }
];

const TRANSFORMERS: TransformerConfig[] = [
    {
        pattern: /^[a-zA-Z]+\d+$/,
        transform: (value: string) => `p.${value}`,
        description: "Variable pattern (e.g., var1, test123)"
    },
    {
        pattern: /^-?\d+(\.\d+)?$/,
        transform: (value: string) => String(Number(value)),
        description: "Numeric string to number"
    }
];

const SPECIAL_CASES: Record<string, (input: string) => string | null> = {
    "url:https": () => JSON.stringify({ url: "https://qa.aventis.swiss/" })
    // "key:pattern": (input) => customLogic(input),
};

// ============================================================================
// CORE UTILITIES
// ============================================================================

/**
 * Checks if a string matches a separator pattern (e.g., " - ", "-", etc.)
 */
const isSeparator = (str: string, pattern: RegExp | string): boolean => {
    if (typeof pattern === "string") {
        return str === pattern;
    }
    return pattern.test(str);
};

/**
 * Applies all registered transformers to a value
 */
const applyTransformers = (value: string): string | number => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "";
    }

    // Giữ nguyên nếu đã có template literal syntax
    if (/\$\{p\.\w+\}/.test(trimmed)) {
        return trimmed;
    }

    // Try each transformer in order
    for (const transformer of TRANSFORMERS) {
        if (transformer.pattern.test(trimmed)) {
            const result = transformer.transform(trimmed);
            // Return number if it's a numeric transformation
            if (transformer.description.includes("number")) {
                return Number(result);
            }
            return result;
        }
    }

    return trimmed;
};

/**
 * Determines if a value contains a specific separator
 */
const containsSeparator = (value: string, config: SeparatorConfig): boolean => {
    if (typeof config.delimiter === "string") {
        return value.includes(config.delimiter);
    }
    return config.delimiter.test(value);
};

/**
 * Gets the highest priority separator found in the value
 */
const getActiveSeparator = (value: string): SeparatorConfig | null => {
    const matchingSeparators = SEPARATOR_CONFIGS.filter((config) => containsSeparator(value, config));

    if (matchingSeparators.length === 0) {
        return null;
    }

    // Return separator with highest priority (lowest number)
    return matchingSeparators.reduce((prev, current) => (prev.priority < current.priority ? prev : current));
};

// ============================================================================
// VALUE PROCESSING ENGINE
// ============================================================================

/**
 * Splits a value by separator, optionally capturing the delimiter
 */
const splitBySeparator = (value: string, config: SeparatorConfig): string[] => {
    if (config.captureDelimiter && config.delimiter instanceof RegExp) {
        return value.split(config.delimiter);
    }

    if (typeof config.delimiter === "string") {
        return value.split(config.delimiter);
    }

    return value.split(config.delimiter);
};

/**
 * Processes items split by a separator, handling nested separators recursively
 */
const processItems = (items: string[], currentConfig: SeparatorConfig, depth: number = 0): any[] => {
    const MAX_DEPTH = 5; // Prevent infinite recursion

    if (depth > MAX_DEPTH) {
        return items.map((item) => item.trim());
    }

    return items.map((item) => {
        // If this item is the separator itself and we want to preserve it, keep it
        if (currentConfig.preserveSpacing && currentConfig.captureDelimiter && isSeparator(item, currentConfig.delimiter)) {
            return item;
        }

        // Check if this item contains a lower-priority (higher number) separator
        const nextSeparator = SEPARATOR_CONFIGS.find((config) => config.priority > currentConfig.priority && containsSeparator(item, config));

        if (nextSeparator) {
            // Recursively process with the next separator
            const subItems = splitBySeparator(item, nextSeparator);
            const processed = processItems(subItems, nextSeparator, depth + 1);
            return nextSeparator.captureDelimiter ? processed.join("") : processed.join(nextSeparator.joinWith);
        }

        // No more separators, apply transformers
        const processed = applyTransformers(item);

        // Don't trim if preserving spacing for dash separator
        if (currentConfig.preserveSpacing && currentConfig.captureDelimiter) {
            return typeof processed === "string" ? processed : String(processed);
        }

        return processed;
    });
};

/**
 * Main value processing function - orchestrates the entire processing pipeline
 */
const processValue = (value: string): any => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return "";
    }

    // Kiểm tra nếu đã có template literal syntax, giữ nguyên
    if (/\$\{p\.\w+\}/.test(trimmedValue)) {
        return trimmedValue;
    }

    // Get the highest priority separator in this value
    const activeSeparator = getActiveSeparator(trimmedValue);

    if (!activeSeparator) {
        // No separators found, just apply transformers
        return applyTransformers(trimmedValue);
    }

    // Split by the active separator để kiểm tra
    const items = splitBySeparator(trimmedValue, activeSeparator);

    // Kiểm tra xem có item nào match với transformer pattern không
    const hasMatchingPattern = items.some((item) => {
        const trimmed = item.trim();
        // Bỏ qua separator
        if (activeSeparator.preserveSpacing && activeSeparator.captureDelimiter && isSeparator(item, activeSeparator.delimiter)) {
            return false;
        }
        // Kiểm tra có match với bất kỳ transformer nào không
        return TRANSFORMERS.some((transformer) => transformer.pattern.test(trimmed));
    });

    // Nếu không có item nào match pattern, giữ nguyên value gốc
    if (!hasMatchingPattern) {
        return trimmedValue;
    }

    // Process items recursively
    const processed = processItems(items, activeSeparator);

    // Return based on separator type
    if (activeSeparator.captureDelimiter) {
        // For dash separator, return as array for template literal processing
        return processed;
    }

    if (activeSeparator.delimiter === ";") {
        // For semicolon, return as string
        return processed.join(activeSeparator.joinWith);
    }

    // For comma separator, return as array for template literal processing
    return processed;
};

// ============================================================================
// TEMPLATE LITERAL GENERATOR
// ============================================================================

/**
 * Converts p.xxx patterns to ${p.xxx} template literal syntax
 */
const convertToTemplateLiteral = (value: string | any[]): string => {
    const processItem = (item: any): string => {
        if (typeof item !== "string") {
            return String(item);
        }
        if (/\$\{p\.\w+\}/.test(item)) {
            return item;
        }
        if (/^\s*-\s*$/.test(item)) {
            return item;
        }
        return item.replace(/p\.([a-zA-Z_]\w*)/g, "${p.$1}");
    };

    if (Array.isArray(value)) {
        // For dash separator, join without adding extra spaces
        const isDashSeparated = value.some((item) => typeof item === "string" && /^\s*-\s*$/.test(item));

        if (isDashSeparated) {
            return value.map(processItem).join("");
        }

        // For comma separator
        return value.map(processItem).join(", ");
    }

    return processItem(value);
};

/**
 * Determines if a value needs template literal wrapping
 */
const needsTemplateLiteral = (value: any): boolean => {
    const hasExistingTemplate = (str: string) => /\$\{p\.\w+\}/.test(str);

    if (Array.isArray(value)) {
        return value.some((item) => {
            if (typeof item === "string") {
                if (hasExistingTemplate(item)) {
                    return false;
                }
                return item.includes("p.");
            }
            return false;
        });
    }

    if (typeof value === "string") {
        if (hasExistingTemplate(value)) {
            return false;
        }
        return value.includes("p.");
    }

    return false;
};

/**
 * Finalizes JSON string by converting variable references to template literals
 */
const finalizeJsonString = (jsonStr: string, result: { [key: string]: any }): string => {
    let finalStr = jsonStr;

    Object.entries(result).forEach(([key, value]) => {
        const keyTrimmed = key.trim();

        // Bỏ qua nếu key là "password"
        if (keyTrimmed === "password") {
            return;
        }

        // Nếu value đã có ${p.xxx}, wrap bằng backtick
        if (typeof value === "string" && /\$\{p\.\w+\}/.test(value)) {
            const originalValue = JSON.stringify(value);
            finalStr = finalStr.replace(`"${keyTrimmed}":${originalValue}`, `"${keyTrimmed}":\`${value}\``);
            return;
        }

        if (needsTemplateLiteral(value)) {
            const templateStr = convertToTemplateLiteral(value);
            const originalValue = JSON.stringify(value);

            finalStr = finalStr.replace(`"${keyTrimmed}":${originalValue}`, `"${keyTrimmed}":\`${templateStr}\``);
        }
    });

    return finalStr;
};

// ============================================================================
// KEY-VALUE PAIR PARSING
// ============================================================================

/**
 * Parses a credential string with multiple key:value pairs separated by |
 */
const parseCredentials = (credentialString: string): Record<string, string> => {
    const credentials: Record<string, string> = {};
    const pairs = credentialString.split("|");

    pairs.forEach((pair) => {
        const match = pair.match(/^([^:]+):(.*)/);
        if (match) {
            const [, key, value] = match;
            credentials[key.trim()] = value.trim();
        } else if (pair.trim()) {
            credentials[pair.trim()] = "";
        }
    });

    return credentials;
};

/**
 * Checks for and handles special cases
 */
const handleSpecialCase = (input: string): string | null => {
    const trimmed = input.trim();

    for (const [pattern, handler] of Object.entries(SPECIAL_CASES)) {
        if (trimmed === pattern) {
            return handler(trimmed);
        }
    }

    return null;
};

/**
 * Parses a single key:value pair
 */
const parseSinglePair = (testDataStr: string): string => {
    // Check special cases first
    const specialResult = handleSpecialCase(testDataStr);
    if (specialResult) {
        return specialResult;
    }

    const match = testDataStr.match(/^([^:]+):(.*)/);
    if (match) {
        const [, key, value] = match;
        const result: Record<string, any> = {};
        result[key.trim()] = processValue(value);
        const jsonStr = JSON.stringify(result);
        return finalizeJsonString(jsonStr, result);
    }

    return testDataStr;
};

/**
 * Parses multiple key:value pairs separated by |
 */
const parseMultiPair = (testDataStr: string): string => {
    const credentials = parseCredentials(testDataStr);
    const result: Record<string, any> = {};

    Object.entries(credentials).forEach(([key, value]) => {
        if (key.trim() === "password") {
            result[key] = value;
        } else {
            result[key] = processValue(value);
        }
    });

    const jsonStr = JSON.stringify(result);
    return finalizeJsonString(jsonStr, result);
};

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Main entry point - formats test data string into structured JSON
 *
 * @param testDataStr - Input string from Excel cell
 * @returns Formatted JSON string ready for Playwright tests
 *
 * @example
 * formatTestData("username:admin|password:secret")
 * // Returns: {"username":"admin","password":"secret"}
 *
 * @example
 * formatTestData("items:var1,var2,var3")
 * // Returns: {"items":`${p.var1}, ${p.var2}, ${p.var3}`}
 */
export const formatTestData = (testDataStr: string): string => {
    // Handle non-string input
    if (typeof testDataStr !== "string") {
        return "";
    }

    if (!testDataStr) return "";

    // If already JSON, return as-is
    if (testDataStr.startsWith("{") && testDataStr.endsWith("}")) {
        return testDataStr;
    }

    const hasMultiPair = testDataStr.includes(":") && testDataStr.includes("|");
    const hasSinglePair = testDataStr.includes(":");

    if (hasMultiPair) {
        return parseMultiPair(testDataStr);
    }

    if (hasSinglePair) {
        return parseSinglePair(testDataStr);
    }

    return testDataStr;
};

// ============================================================================
// EXTENSIBILITY HELPERS - For future enhancements
// ============================================================================

/**
 * Registers a new separator configuration
 * @example
 * registerSeparator({
 *   delimiter: "/",
 *   priority: 4,
 *   joinWith: " / ",
 *   preserveSpacing: false
 * });
 */
export const registerSeparator = (config: SeparatorConfig): void => {
    SEPARATOR_CONFIGS.push(config);
    SEPARATOR_CONFIGS.sort((a, b) => a.priority - b.priority);
};

/**
 * Registers a new transformer for pattern matching
 * @example
 * registerTransformer({
 *   pattern: /^#[0-9A-Fa-f]{6}$/,
 *   transform: (val) => `color.${val}`,
 *   description: "Hex color code"
 * });
 */
export const registerTransformer = (config: TransformerConfig): void => {
    TRANSFORMERS.unshift(config); // Add to beginning for priority
};

/**
 * Registers a special case handler
 * @example
 * registerSpecialCase("date:today", () =>
 *   JSON.stringify({ date: new Date().toISOString() })
 * );
 */
export const registerSpecialCase = (pattern: string, handler: (input: string) => string): void => {
    SPECIAL_CASES[pattern] = handler;
};
