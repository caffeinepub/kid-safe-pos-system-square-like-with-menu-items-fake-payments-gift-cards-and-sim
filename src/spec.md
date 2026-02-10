# Specification

## Summary
**Goal:** Build a kid-safe, Square-like POS experience with a clickable menu, cart, simulated checkout (fake cash, gift cards, simulated online cards), stored transactions, and printable receipts.

**Planned changes:**
- Create a POS Terminal screen with a menu item grid/list (name, price) that adds items to a cart on tap/click, with quantity adjustments, remove actions, and live-updating subtotal/total.
- Add Menu Management to create, edit, and delete menu items (name, price, optional color/category) with persistence in a single Motoko backend actor.
- Implement checkout flow using fake money only: prevent checkout with empty cart, choose payment method (Fake Cash, Gift Card, Online Credit Card), confirm, finalize sale, clear cart, and record a transaction.
- Add Gift Cards: issue a gift card with generated code/ID and starting balance, look up balance by code/ID, pay with gift card at checkout with balance checks and deduction, and store gift card reference on the transaction.
- Add simulated Online Credit Card payment form (cardholder name, card number, expiry, CVC) with basic client-side validation and no real payment API integration; record as simulated.
- Store and expose transaction history from the backend with receipt-ready details (items snapshot, quantities, unit prices, totals, timestamp, payment method, gift card code/ID if used).
- Create Receipts UI: display receipt after sale, allow reopening from transaction history, and support printing via browser print dialog.
- Add navigation layout with sections for POS Terminal, Menu, Gift Cards, and Transactions/Receipts, usable on desktop and mobile widths.
- Apply a cohesive kid-safe theme (playful, warm colors; avoid predominantly blue/purple) across screens and components.
- Add safeguards and UX: numeric non-negative price enforcement, confirm before deleting menu items, and friendly error states for backend/network failures (including checkout validation errors).
- Add and use generated static branding/empty-state images from frontend static assets (not served from backend).

**User-visible outcome:** Users can manage a menu, tap items to build a cart, complete pretend checkouts via fake cash/gift cards/simulated cards, view and print receipts, manage gift cards and balances, and review past transactions in a playful kid-safe UI.
