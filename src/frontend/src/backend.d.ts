import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CustomCreditCard {
    identifier: string;
    qrPayload: string;
}
export interface GiftCard {
    balance: number;
    code: string;
}
export interface MenuItem {
    name: string;
    category?: string;
    price: number;
}
export interface backendInterface {
    addCustomCreditCard(identifier: string, qrPayload: string): Promise<void>;
    addMenuItem(name: string, price: number, category: string | null): Promise<void>;
    completeTransaction(items: Array<MenuItem>, total: number, paymentMethod: string): Promise<void>;
    editMenuItem(index: bigint, name: string, price: number, category: string | null): Promise<void>;
    getGiftCard(code: string): Promise<GiftCard>;
    getMenu(): Promise<Array<MenuItem>>;
    getMenuByCategory(): Promise<Array<MenuItem>>;
    issueGiftCard(code: string, balance: number): Promise<void>;
    removeMenuItem(index: bigint): Promise<void>;
    useGiftCard(code: string, amount: number): Promise<void>;
    validateCustomCreditCard(qrPayload: string): Promise<string>;
}
