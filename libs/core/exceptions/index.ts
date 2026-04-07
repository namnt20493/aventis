/**
 * Custom Exceptions for the Aventis Test Framework
 *
 * These exceptions provide typed error handling for common test scenarios.
 */

/**
 * Thrown when an expected element cannot be found on the page.
 */
export class ElementNotFoundException extends Error {
    readonly selector: string;
    readonly timeout?: number;

    constructor(message: string, selector: string, timeout?: number) {
        super(message);
        this.name = "ElementNotFoundException";
        this.selector = selector;
        this.timeout = timeout;
    }

    static forTestId(testId: string, timeout?: number): ElementNotFoundException {
        return new ElementNotFoundException(
            `Element with data-testid="${testId}" not found${timeout ? ` within ${timeout}ms` : ""}`,
            `[data-testid="${testId}"]`,
            timeout
        );
    }

    static forSelector(selector: string, timeout?: number): ElementNotFoundException {
        return new ElementNotFoundException(
            `Element matching "${selector}" not found${timeout ? ` within ${timeout}ms` : ""}`,
            selector,
            timeout
        );
    }
}

/**
 * Thrown when test data is invalid or missing.
 */
export class TestDataException extends Error {
    readonly dataField?: string;
    readonly expectedType?: string;
    readonly actualValue?: unknown;

    constructor(message: string, dataField?: string, expectedType?: string, actualValue?: unknown) {
        super(message);
        this.name = "TestDataException";
        this.dataField = dataField;
        this.expectedType = expectedType;
        this.actualValue = actualValue;
    }

    static missingField(fieldName: string): TestDataException {
        return new TestDataException(`Required test data field "${fieldName}" is missing or undefined`, fieldName);
    }

    static invalidType(fieldName: string, expectedType: string, actualValue: unknown): TestDataException {
        return new TestDataException(
            `Test data field "${fieldName}" has invalid type. Expected ${expectedType}, got ${typeof actualValue}`,
            fieldName,
            expectedType,
            actualValue
        );
    }

    static invalidValue(fieldName: string, message: string, actualValue?: unknown): TestDataException {
        return new TestDataException(`Test data field "${fieldName}": ${message}`, fieldName, undefined, actualValue);
    }
}

/**
 * Thrown when an assertion fails in a test.
 */
export class AssertionException extends Error {
    readonly expected?: unknown;
    readonly actual?: unknown;
    readonly assertion: string;

    constructor(message: string, assertion: string, expected?: unknown, actual?: unknown) {
        super(message);
        this.name = "AssertionException";
        this.assertion = assertion;
        this.expected = expected;
        this.actual = actual;
    }

    static notEqual(expected: unknown, actual: unknown, context?: string): AssertionException {
        const contextMsg = context ? ` (${context})` : "";
        return new AssertionException(
            `Expected "${expected}" but got "${actual}"${contextMsg}`,
            "equal",
            expected,
            actual
        );
    }

    static notVisible(elementDescription: string): AssertionException {
        return new AssertionException(`Element "${elementDescription}" is not visible`, "visible");
    }

    static notEnabled(elementDescription: string): AssertionException {
        return new AssertionException(`Element "${elementDescription}" is not enabled`, "enabled");
    }

    static notContaining(container: string, expected: string): AssertionException {
        return new AssertionException(
            `Expected "${container}" to contain "${expected}"`,
            "contains",
            expected,
            container
        );
    }
}

/**
 * Thrown when a page navigation fails.
 */
export class NavigationException extends Error {
    readonly url?: string;
    readonly expectedUrl?: string;

    constructor(message: string, url?: string, expectedUrl?: string) {
        super(message);
        this.name = "NavigationException";
        this.url = url;
        this.expectedUrl = expectedUrl;
    }

    static timeout(url: string, timeout: number): NavigationException {
        return new NavigationException(`Navigation to "${url}" timed out after ${timeout}ms`, url);
    }

    static unexpectedUrl(expectedUrl: string, actualUrl: string): NavigationException {
        return new NavigationException(
            `Expected to navigate to "${expectedUrl}" but landed on "${actualUrl}"`,
            actualUrl,
            expectedUrl
        );
    }
}

/**
 * Thrown when a dialog operation fails.
 */
export class DialogException extends Error {
    readonly dialogSelector?: string;
    readonly operation: string;

    constructor(message: string, operation: string, dialogSelector?: string) {
        super(message);
        this.name = "DialogException";
        this.operation = operation;
        this.dialogSelector = dialogSelector;
    }

    static notFound(dialogSelector: string): DialogException {
        return new DialogException(`Dialog "${dialogSelector}" not found`, "find", dialogSelector);
    }

    static failedToClose(dialogSelector: string): DialogException {
        return new DialogException(`Failed to close dialog "${dialogSelector}"`, "close", dialogSelector);
    }

    static failedToOpen(triggerDescription: string): DialogException {
        return new DialogException(`Failed to open dialog by clicking "${triggerDescription}"`, "open");
    }
}
