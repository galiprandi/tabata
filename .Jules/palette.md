## 2024-10-31 - [Accessibility for Icon-only Buttons and Inputs]

**Learning:** Icon-only buttons and inputs within a HIIT timer app often rely on visual cues (icons) that are not accessible to screen reader users. Adding `aria-label` provides the necessary context without altering the visual design.
**Action:** Always check for `aria-label` or `title` on buttons that do not contain visible text and on inputs that rely on icon-based labels.

## 2024-11-20 - [Reset to Defaults UX Pattern]

**Learning:** Providing a "Reset to Defaults" option in configuration-heavy interfaces (like workout timers) is a high-value micro-UX improvement. It gives users a "safe way back" when they've over-customized settings.
**Action:** Look for opportunities to add reset-to-default functionality in complex configuration views, ensuring it's accessible and requires confirmation.

## 2025-01-24 - [Empty State UX Pattern]

**Learning:** Providing a clear "empty state" when a list (like exercises) is empty prevents user confusion and provides a direct path to action. A good empty state includes a helpful message and a prominent "Add" button.
**Action:** Always implement an empty state for dynamic lists to guide the user when no data is present.
