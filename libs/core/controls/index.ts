/**
 * Core Controls Module
 *
 * This module exports all UI control classes for the Aventis test framework.
 * Each control provides a typed, stable interface for interacting with specific
 * UI element types in Angular Material applications.
 *
 * Usage:
 * ```typescript
 * import { Button, TextInput, Dropdown } from "@core/controls";
 *
 * const submitBtn = Button.byTestId(page, "submit");
 * const nameInput = TextInput.byLabel(page, "Name");
 * const statusDropdown = Dropdown.byAngularTestId(page, "status");
 * ```
 */

export { ControlBase } from "./control-base";
export { TextInput } from "./text-input";
export { Button } from "./button";
export { Dropdown } from "./dropdown";
export { Checkbox } from "./checkbox";
export { DatePicker } from "./date-picker";
export { Link } from "./link";
export { Table } from "./table";
export { Tab } from "./tab";
