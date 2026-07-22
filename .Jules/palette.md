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

## 2025-10-10 - [Clipboard Feedback State Safety]

**Learning:** When using temporary visual feedback (like replacing a button's icon with a checkmark "✓" on click), subsequent clicks during the timeout can capture the feedback state as the "original" state, causing the button to get stuck.
**Action:** Always check if the feedback state is already active (e.g., `btn.innerHTML !== "✓"`) before initiating the feedback cycle.

## 2025-10-11 - [In-button Feedback Preservation]

**Learning:** Replacing the entire `innerHTML` of a button with "✓" for feedback can be visually disruptive as it removes icons and changes layout.
**Action:** Target only the text-containing element (e.g., a nested `<span>`) for feedback when possible to preserve the button's visual structure.

## 2025-10-10 - [SearchBar Keyboard UX]

**Learning:** Supporting the 'Escape' key to clear search inputs is a standard expectation. It should not only clear the UI but also reset the search state (e.g., dispatching a 'search' event with an empty query).
**Action:** Add a `keydown` listener for 'Escape' in search components to improve keyboard efficiency.

## 2025-08-15 - [Native Sharing UX]

**Learning:** Implementing the native Web Share API (`navigator.share`) significantly improves the sharing experience on mobile devices, making it feel like a first-class app interaction. A robust fallback to clipboard copying ensures functionality on all platforms.
**Action:** Use native sharing when possible, providing translatable titles and text, and always include a clipboard fallback with user feedback (e.g., localized alerts).

## 2024-07-11 - [Dictionary Key Consistency and Reuse]
**Learning:** Standardizing dictionary keys and reusing existing ones (e.g., using "Work" instead of "Working") ensures UI consistency and reduces technical debt. Inconsistent casing or redundant keys (like "Pause" vs "Pausar") lead to maintenance overhead.
**Action:** Always audit 'src/assets/dictionary.ts' for existing concepts before adding new keys, and strictly follow the project's casing conventions (PascalCase for UI labels).

## 2025-07-14 - [Reliable UI Visibility Checks]
**Learning:** Checking `element.style.display` in scripts only works for inline styles. For elements hidden via CSS classes (common in this app's Astro/Pico CSS setup), it returns an empty string, leading to incorrect logic states.
**Action:** Use `window.getComputedStyle(el).display !== "none"` for reliable visibility checks when implementing keyboard shortcuts or conditional logic.

## 2025-11-20 - [Empty Results Recovery Pattern]
**Learning:** Providing a direct "Clear search" action within the "No results found" state significantly reduces friction for users who have over-filtered their lists.
**Action:** Always include a recovery button (e.g., "Clear search" or "View all") in empty search result states to prevent dead ends.

## 2025-12-05 - [Localizing Scoped Event Listeners to Prevent Global Keyboard Hijacking]
**Learning:** Registering a keydown event listener on the global `document` for dropdown or selector menu navigation (such as ArrowUp/ArrowDown) can easily hijack keyboard navigation and prevent standard scrolling page-wide, even when other elements have focus.
**Action:** Always register list/dropdown navigation keydown listeners directly on the specific container element (e.g., `#routine-selector`) rather than on `document`, and use `window.getComputedStyle(dropdown).display !== "none"` to determine its active state.

## 2026-06-25 - [Cohesive Initial-Load Accessibility and Interactive ARIA States]
**Learning:** Relying solely on localization-driven attributes (such as `data-i18n-title`) can leave interactive components inaccessible before dynamic translations load or if scripts fail. Additionally, collapsible interfaces must explicitly communicate state.
**Action:** Always provide fallback standard `title` and `aria-label` attributes alongside `data-i18n-` translations, use `aria-hidden="true"` on inline SVGs inside buttons, and dynamically maintain `aria-expanded` attributes on togglable containers.

## 2026-07-19 - [Hiding Contextual Actions on Empty States]
**Learning:** Showing action buttons (e.g., "Clear History" or "Share Progress") when there is no content to act upon causes user confusion, potential errors, or useless notifications. Hiding or disabling these actions on empty states significantly cleans up the visual hierarchy and guides the user toward the primary call to action.
**Action:** Always verify if list-dependent action buttons should be conditionally hidden or disabled when the underlying list or data is empty.

## 2026-07-20 - [Multi-Sensory Feedback and Native Tooltips on Interactive Buttons]
**Learning:** Integrating native-styled tooltips on icon-only and compact buttons significantly aids low-vision and keyboard-navigating users. Additionally, playing interactive audio cue 'tap' before showing modal/confirm dialogs provides a delightful, multi-sensory response that is characteristic of native fitness applications.
**Action:** Always include data-tooltip and data-i18n-title on icon-only/compact buttons, and call play("tap", true) before triggering synchronous window.confirm() dialogs.

## 2026-07-21 - [Displaying Keyboard Shortcut Hints]
**Learning:** Displaying localized keyboard shortcut hints directly under start/pause action containers significantly improves accessibility and discoverability for desktop/keyboard users without cluttering the main UI.
**Action:** When implementing global keyboard event listeners (such as Space, Enter, or Escape on overlay screens), add a subtle, localized '.keyboard-hint' element and corresponding tooltips on core action buttons.
