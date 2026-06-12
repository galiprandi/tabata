## 2024-10-31 - [Accessibility for Icon-only Buttons and Inputs]
**Learning:** Icon-only buttons and inputs within a HIIT timer app often rely on visual cues (icons) that are not accessible to screen reader users. Adding `aria-label` provides the necessary context without altering the visual design.
**Action:** Always check for `aria-label` or `title` on buttons that do not contain visible text and on inputs that rely on icon-based labels.
