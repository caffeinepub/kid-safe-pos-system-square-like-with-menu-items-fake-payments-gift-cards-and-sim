import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import CreditCardsScreen from "./features/creditcards/CreditCardsScreen";
import GiftCardsScreen from "./features/giftcards/GiftCardsScreen";
import MenuManagementScreen from "./features/menu/MenuManagementScreen";
import POSScreen from "./features/pos/POSScreen";
import ReceiptScreen from "./features/receipts/ReceiptScreen";
import TransactionsScreen from "./features/transactions/TransactionsScreen";

export type CartItem = {
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

function App() {
  const [activeTab, setActiveTab] = useState("pos");
  const [currentReceiptId, setCurrentReceiptId] = useState<string | null>(null);

  const handleCheckoutComplete = (receiptId: string) => {
    setCurrentReceiptId(receiptId);
    setActiveTab("receipt");
  };

  const handleViewReceipt = (receiptId: string) => {
    setCurrentReceiptId(receiptId);
    setActiveTab("receipt");
  };

  const handleBackToPOS = () => {
    setCurrentReceiptId(null);
    setActiveTab("pos");
  };

  return (
    <AppLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl mx-auto mb-6">
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
          <TabsTrigger value="creditcards">Cards</TabsTrigger>
          <TabsTrigger value="transactions">History</TabsTrigger>
          <TabsTrigger value="receipt" disabled={!currentReceiptId}>
            Receipt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="mt-0">
          <POSScreen onCheckoutComplete={handleCheckoutComplete} />
        </TabsContent>

        <TabsContent value="menu" className="mt-0">
          <MenuManagementScreen />
        </TabsContent>

        <TabsContent value="giftcards" className="mt-0">
          <GiftCardsScreen />
        </TabsContent>

        <TabsContent value="creditcards" className="mt-0">
          <CreditCardsScreen />
        </TabsContent>

        <TabsContent value="transactions" className="mt-0">
          <TransactionsScreen onViewReceipt={handleViewReceipt} />
        </TabsContent>

        <TabsContent value="receipt" className="mt-0">
          {currentReceiptId && (
            <ReceiptScreen
              receiptId={currentReceiptId}
              onBack={handleBackToPOS}
            />
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

export default App;
