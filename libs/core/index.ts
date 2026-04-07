/**
 * Aventis Core Module
 *
 * Central export point for all core framework components:
 * - Interfaces: Control and locator interfaces for framework independence
 * - Controls: Typed UI control classes (Button, TextInput, Dropdown, etc.)
 * - Base: Page object base class
 * - Exceptions: Typed exception classes
 *
 * Architecture:
 * - Page Objects depend only on interfaces (Playwright-independent)
 * - Controls implement interfaces with Playwright-specific logic
 * - This enables testing frameworks to be swapped without changing Page Objects
 *
 * Usage:
 * ```typescript
 * import { Button, TextInput, PageObjectBase } from "@core";
 * // or
 * import { IButton, ITextInput } from "@core/interfaces";
 * import { Button } from "@core/controls";
 * import { PageObjectBase } from "@core/base";
 * ```
 */

// Re-export all interfaces
export * from "./interfaces";

// Re-export all controls
export * from "./controls";

// Re-export base classes
export * from "./base";

// Re-export services
export * from "./services";

// Re-export exceptions
export * from "./exceptions";
