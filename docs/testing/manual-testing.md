# Manual testing

Manual checks supplement white-box tests when behaviour depends on a real platform, visual presentation, native picker, or assistive technology. They do not replace automated coverage for deterministic logic.

Record each check with its platform, setup, steps, expected result, and outcome.

Current high-value manual areas include:

- complete entry and template CRUD on supported targets;
- nested section editing and ordering;
- partially typed and invalid date/time values;
- native and web document-picker behaviour;
- bundled image rendering and image-boolean interaction;
- persistence across an actual application restart;
- keyboard and screen-reader navigation;
- touch-target usability, contrast, and reduced-motion behaviour;
- responsive behaviour at supported web viewport sizes.

Close each implementation backlog item with one concrete manual check proportionate to that change.

