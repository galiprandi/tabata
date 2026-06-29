## 2024-10-31 - [Accessibility for Icon-only Buttons and Inputs]

**Learning:** Icon-only buttons and inputs within a HIIT timer app often rely on visual cues (icons) that are not accessible to screen reader users. Adding `aria-label` provides the necessary context without altering the visual design.
**Action:** Always check for `aria-label` or `title` on buttons that do not contain visible text and on inputs that rely on icon-based labels.

## 2024-11-20 - [Reset to Defaults UX Pattern]

**Learning:** Providing a "Reset to Defaults" option in configuration-heavy interfaces (like workout timers) is a high-value micro-UX improvement. It gives users a "safe way back" when they've over-customized settings.
**Action:** Look for opportunities to add reset-to-default functionality in complex configuration views, ensuring it's accessible and requires confirmation.

## 2025-01-24 - [Empty State UX Pattern]

**Learning:** Providing a clear "empty state" when a list (like exercises) is empty prevents user confusion and provides a direct path to action. A good empty state includes a helpful message and a prominent "Add" button.
**Action:** Always implement an empty state for dynamic lists to guide the user when no data is present.

## 2026-06-22 - [Toggle Control Accessibility]

**Learning:** ARIA labels for toggle controls (e.g., audio on/off) must describe the _action_ taken upon interaction (e.g., "Turn audio off") rather than the current state of the system. This provides clear intent to screen reader users.
**Action:** Always verify that toggle buttons have labels representing the transition, and use 'inline-flex' for icon button display to maintain design system alignment.

## 2025-05-15 - [Safe Action Dispatching in Shared Templates]

**Learning:** When using shared templates with multiple action buttons, identifying buttons by simple substrings (e.g., `className.includes("up")`) is brittle and can lead to multiple actions being triggered if class names overlap (e.g., "up" matching "duplicate").
**Action:** Use `element.classList.contains()` for exact class matching to ensure one button triggers exactly one intended action.

## 2025-07-15 - [Modal Focus Management]

**Learning:** To ensure keyboard accessibility in help components, focus must be programmatically shifted to the close button when a dialog opens and returned to the trigger button when it closes.
**Action:** When implementing native `<dialog>` elements, use `dialog.showModal()`, focus the close button immediately, and use a `once: true` listener on the 'close' event to restore focus.
