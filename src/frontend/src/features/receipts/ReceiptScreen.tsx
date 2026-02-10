import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTransactionStore } from '@/state/transactionsStore';

interface ReceiptScreenProps {
  receiptId: string;
  onBack: () => void;
}

export default function ReceiptScreen({ receiptId, onBack }: ReceiptScreenProps) {
  const transaction = useTransactionStore((state) =>
    state.transactions.find((t) => t.id === receiptId)
  );

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Receipt not found</p>
            <Button onClick={onBack} className="mt-4 mx-auto block">
              Back to POS
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="no-print mb-4 flex gap-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
      </div>

      <Card className="print-receipt">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Kid's POS</CardTitle>
          <p className="text-sm text-muted-foreground">Receipt</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(transaction.timestamp).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />

          <div className="space-y-3">
            {transaction.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${transaction.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${transaction.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Payment Method:</span>{' '}
              <span className="font-medium">{transaction.paymentMethod}</span>
            </p>
            <div className="fake-money-badge mx-auto">
              🎮 Fake Money Transaction
            </div>
          </div>

          <Separator />

          <div className="text-center text-xs text-muted-foreground">
            <p>Thank you for playing!</p>
            <p className="mt-1">Transaction ID: {transaction.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
