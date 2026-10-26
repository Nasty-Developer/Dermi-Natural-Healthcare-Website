---
name: Local GlowAI behavior
description: The user's requirement that GlowAI works without paid AI services, API keys, or external AI APIs.
---

GlowAI must use local keyword matching against the website's catalog and published content. Do not send chat messages to external AI services or require API keys. Do not invent products, ingredients, prices, shipping/return policies, usage instructions, or medical claims. When information is not present, say it is not listed and direct the visitor to the existing WhatsApp contact.

**Why:** The user explicitly requested a functional chatbot without keys, paid AI, or external AI APIs.

**How to apply:** Keep the response engine local and lightweight. Derive product answers from catalog fields, avoid persisting chat messages, and use honest fallbacks for missing policy or medical information.
