## 2026-08-05 - [Overlay Modal Backdrop Dismissal and Click-Outside Dismissal Consistency]

**Learning:** When implementing backdrop click-outside dismissal/resume behaviors for full-screen overlay components (such as `#shared-routine-modal`, `#save-confirmation-modal`, or `#pause-overlay`), checking `e.target === overlayElement` is a highly robust, non-disruptive pattern that preserves active click events on inner content cards/buttons. This aligns with modern desktop/mobile dismiss gestures and ensures keyboard-focused or sweaty users can exit overlays gracefully without having to precisely target a small visual close/resume button.
**Action:** Always wrap or handle overlay modals with backdrop clicks checked against `e.target === overlayElement` to trigger close/resume handlers, and ensure any sibling element overlay z-indices are managed to avoid click blockages.

## 2026-08-03 - [Dynamic Tab Title Countdown Feedback]

**Learning:** In timer-based applications, users frequently switch tabs or multitask during workouts or rest periods. Dynamically updating the browser's `document.title` with the active phase (e.g., Prep, Work, Rest) and the remaining countdown seconds, prepending `[Paused]` on pause, and cleanly restoring the original title on completion or exit provides an exceptional background-visibility micro-UX.
**Action:** When implementing real-time countdown loops, continuously update `document.title` with structured progress text and ensure original title state is preserved and restored under all exit paths (restart, completion, back-navigation).

## 2026-07-26 - [Interactive Container Keyboard Accessibility]

**Learning:** Rendering list elements (like routine cards in `trainer.astro`) as standard structural components (like `<article>`) makes them completely invisible to keyboard-only and screen reader users. Giving them interactive roles, tabindices, accessible labels, and custom keydown listeners makes lists fully keyboard accessible.
**Action:** Always add `tabindex="0"`, `role="button"`, and a keydown listener for "Enter" and "Space" (with `e.preventDefault()`) on structural container elements that are clickable, along with clear focus indicators using `:focus-visible`.

## 2026-08-01 - [High-Performance Modal Focus and Keyboard Scoping]

**Learning:** Adding global `document` event listeners for modal shortcuts causes key-hijacking and memory leaks. Furthermore, recursively checking style lookups with MutationObservers triggers layout thrashing (forced reflows). Using IntersectionObserver to trigger autofocus on element intersections, and registering local `keydown` listeners on the modal container itself, guarantees zero memory leaks, zero layout thrashing, and zero global shortcut pollution. When implementing `Enter` shortcuts, always verify that the active element is not already another button (e.g. Cancel) to prevent critical usability regressions.
**Action:** Avoid global document listeners and MutationObservers for modal accessibility; register `keydown` listeners locally on the component's container, check `!(document.activeElement instanceof HTMLButtonElement)` before forcing the primary action, and use IntersectionObserver asynchronously for focusing elements.

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

## 2026-07-22 - [Scoping Script Selectors in Reusable Astro Components]

**Learning:** In Astro, client-side scripts inside components are bundled globally and execute on the entire page. If a component is rendered multiple times (e.g., multiple Help dialogs on a single settings page) and uses general global selectors like `document.querySelector(".help-modal")`, all instances will target and interact with only the first rendered element in the DOM.
**Action:** Always scope DOM queries in Astro component scripts by selecting container elements (e.g., using `document.querySelectorAll(".helper-container")`) and querying inside those specific containers to ensure complete isolation, proper event bindings, and accurate focus management.

## 2026-07-23 - [Keyboard Submit and Accessible Save Feedback on Textareas]

**Learning:** Long-form inputs like coach notes are highly used. Enabling keyboard-based submission (e.g., `Ctrl+Enter` or `Cmd+Enter`) dramatically increases power-user efficiency. Furthermore, when submitting, blurring the textarea and setting temporary screen-reader-accessible feedback state on the submit button (e.g., setting `aria-label` and `title` to "Note saved successfully" along with the "✓" checkmark icon) ensures clear visual and non-visual completion signals.
**Action:** Implement `Ctrl+Enter` listener on textareas, blur them upon successful submit, and use transient accessible labels/attributes on the submission button that are properly restored after the visual timeout.

## 2026-07-24 - [Consistent Pico CSS Native Dialog Backdrop Dismissal]

**Learning:** In Pico CSS modal design, native `<dialog>` elements must wrap content inside `<article>` to apply standard layout, width constraints, and backdrop blur. Omitting `<article>` leaves related dialog styles completely unused. Moreover, when `<dialog>` is wrapped with `<article>`, clicking on the background backdrop corresponds directly to clicking the `<dialog>` container itself; listening for clicks where `e.target === dialog` provides an incredibly robust, zero-dependency "click-outside-to-close" pattern.
**Action:** Always wrap native `<dialog>` contents in `<article>`, apply click-outside-to-close logic via `e.target === dialog`, and use `aria-hidden="true"` on nested decorative close icons to ensure clean desktop/mobile keyboard and screen reader accessibility.

## 2026-07-25 - [Accessible and Safe Clipboard Copy Feedback on Icon-only Buttons]

**Learning:** When implementing temporary visual feedback (such as checkmark '✓' for copy/success) on icon-only buttons, subsequent clicks during the timeout can capture the feedback state as the original, causing the button to get stuck. Furthermore, updating only the visual content leaves screen reader and tooltip users with outdated or misleading instructions (e.g., they still hear "Share routine" instead of "Link copied to clipboard").
**Action:** Always guard against race conditions with `if (button.innerHTML === "✓") return;` at the start of the click handler. Store and restore original `aria-label`, `title`, and `data-tooltip` attributes, and update them to localized confirmation messages (e.g., via `t("Link copied to clipboard")`) during the temporary success state.

## 2026-08-04 - [New Exercise Input Keyboard Shortcuts]

**Learning:** When users manage lists or create new exercises within the Routine Editor, providing simple, expected keyboard shortcuts in the input field significantly enhances interactive efficiency. Pressing `Enter` should add the new exercise directly to the list (accompanied by a delightful tap sound), while pressing `Escape` at any point should clear the input's content and blur focus, releasing keyboard trap.
**Action:** Replace standard keypress/change handlers with a robust `keydown` listener on the text input. If key is "Enter", prevent default and dispatch the save/add action; if key is "Escape", prevent default, reset the value to empty, and programmatically blur the input.
