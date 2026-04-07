/**
 * Core Interfaces Module
 *
 * This module exports all interfaces for the Aventis test framework.
 * These interfaces enable decoupling of Page Objects from Playwright.
 *
 * Architecture:
 * - Page Objects (pages-v2) depend only on interfaces
 * - Controls (controls/) implement interfaces with Playwright
 * - This allows Page Objects to be framework-independent
 */

// Base control interface
export { IControl } from "./IControl";

// Specific control interfaces
export { IButton, IButtonClickOptions } from "./IButton";
export { ITextInput, ITextInputFillOptions } from "./ITextInput";
export { IDropdown, IDropdownSelectOptions } from "./IDropdown";
export { ICheckbox, ICheckboxOptions } from "./ICheckbox";
export { IDatePicker } from "./IDatePicker";
export { ILink, ILinkClickOptions } from "./ILink";
export { ITable, ITableRow } from "./ITable";
export { ITab } from "./ITab";

// Locator and stability interfaces
export { ILocatorProvider, IElementLocator } from "./ILocatorProvider";
export {
    IStabilityHelper,
    IStableClickOptions,
    IStableFillOptions,
    IStableSelectOptions,
    IStabilityOptions,
    IDialogOptions,
    ITableRowClickOptions,
    IDragAndDropOptions
} from "./IStabilityHelper";

// Service architecture
export { IServiceContext } from "./IServiceContext";
export { IStabilityService } from "./IStabilityService";
