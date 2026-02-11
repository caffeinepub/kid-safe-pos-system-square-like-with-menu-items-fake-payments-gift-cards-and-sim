# Specification

## Summary
**Goal:** Revert the POS UI back to the non-QR design by removing the custom QR credit card feature, its navigation entry, and the QR-based checkout/scanner flow.

**Planned changes:**
- Remove the “Cards” tab from the main navigation and ensure the CustomCreditCardsScreen is no longer reachable or rendered anywhere.
- Update the tab layout/grid so remaining tabs keep correct spacing and alignment after removing “Cards”.
- Revert the Checkout dialog to remove the “QR Credit Card” payment option and eliminate any in-app QR scanner/camera flow (do not render QRCardPaymentPanel).
- Clean up unused QR/custom-card frontend modules, hooks, and imports so the build has no remaining references and makes no Google Charts QR-code URL requests.

**User-visible outcome:** The app no longer shows a “Cards” tab or any QR-based credit card payment/scanning in checkout; purchases still complete using the remaining payment methods (e.g., cash and gift card).
