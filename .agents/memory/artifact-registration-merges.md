---
name: Artifact registration during merges
description: How Replit artifact registration responds to a conflicted artifact manifest.
---

A conflict in an artifact manifest can temporarily remove that artifact from the project preview and workflow list. Resolve the manifest to a valid existing configuration, then check whether the artifact has registered again before trying to recreate it.

**Why:** During a GitHub merge, conflict markers in the website's artifact manifest caused Replit to remove its preview and workflow. Resolving the existing manifest automatically restored both.

**How to apply:** After resolving an artifact-manifest conflict, check the artifact list and configured workflows. Restart the restored workflow only after registration returns.
