---
name: GitHub proxy push behavior
description: This file covers how pushes through the Replit secure GitHub proxy may rewrite local commit history.
---

After pushing a merged branch through the secure GitHub proxy, verify the remote branch, local tracking status, and tree contents. The proxy may replace the local merge commit with a new single-parent commit while retaining the same tree.

**Why:** A normal push in this workspace changed the merge commit hash and parent history, but the resulting `main` tree matched the verified merge exactly and the tracking branch was clean.

**How to apply:** Do not assume the pushed merge commit hash persists. Confirm the remote `main` ref and compare the resulting tree with the verified pre-push tree before finalizing.
