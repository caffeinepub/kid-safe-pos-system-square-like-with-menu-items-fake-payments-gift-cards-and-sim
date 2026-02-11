# Specification

## Summary
**Goal:** Add custom QR-based “credit cards” and a QR scanner-driven checkout flow that validates scanned tokens with the backend and records the chosen card on receipts.

**Planned changes:**
- Backend: add CRUD for custom QR credit card records (display name + QR token/payload) and an endpoint to validate a scanned token and return matching card info.
- Frontend: add a management screen to create/list/delete custom QR credit cards and render each card’s QR code.
- Frontend: replace the existing checkout “credit card” payment UI with an in-app QR scanner flow, including a manual token entry fallback when camera/scan is unavailable.
- Both: when completing a transaction via QR card, store and display a payment method label that includes the scanned card’s human-readable name/identifier on the receipt.

**User-visible outcome:** Users can create QR credit cards in-app, scan a card’s QR code when paying by credit card (or manually enter the token), complete checkout immediately after validation, and see which QR card was used on the receipt.
