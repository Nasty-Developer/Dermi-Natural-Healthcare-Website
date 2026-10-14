---
name: Visual preview reveal behavior
description: Capturing pages with scroll-triggered reveal animations in the app preview.
---

For visual verification, a full-page screenshot may leave below-the-fold content hidden when the page reveals sections only after they enter the viewport. Use a tall initial viewport that includes the target section so its existing reveal behavior activates.

**Why:** Initial full-page captures showed blank areas where the Directors section had not entered view; a tall viewport exposed it without changing the page or its animations.

**How to apply:** When preview screenshots omit sections with existing reveal animations, increase viewport height to bring those sections into the initial viewport before judging the layout.
