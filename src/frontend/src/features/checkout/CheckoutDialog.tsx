import { useState } from 'react';
import { CreditCard, Banknote, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompleteTransaction } from '@/hooks/useCompleteTransaction';
import { useGiftCardPayment } from '@/hooks/useGiftCards';
import SimulatedCardForm from './SimulatedCardForm';
import type { CartItem } from '../../App';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  total: number;
  onSuccess: (receiptId: string) => void;
}

type PaymentMethod = 'cash' | 'giftcard' | 'card';

export default function CheckoutDialog({
  open,
  onOpenChange,
  cart,
  total,
  onSuccess,
}: CheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [cardValid, setCardValid] = useState(false);
  const [error, setError] = useState('');

  const completeMutation = useCompleteTransaction();
  const giftCardMutation = useGiftCardPayment();

  const resetForm = () => {
    setPaymentMethod('cash');
    setGiftCardCode('');
    setCardValid(false);
    setError('');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleCheckout = async () => {
    setError('');

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      let paymentMethodLabel = '';

      if (paymentMethod === 'giftcard') {
        if (!giftCardCode.trim()) {
          setError('Please enter a gift card code');
          return;
        }
        await giftCardMutation.mutateAsync({ code: giftCardCode.trim(), amount: total });
        paymentMethodLabel = `Gift Card (${giftCardCode.trim()})`;
      } else if (paymentMethod === 'card') {
        if (!cardValid) {
          setError('Please fill in all card details');
          return;
        }
        paymentMethodLabel = 'Online Credit Card (Simulated)';
      } else {
        paymentMethodLabel = 'Fake Cash';
      }

      const receiptId = await completeMutation.mutateAsync({
        items: cart,
        total,
        paymentMethod: paymentMethodLabel,
      });

      resetForm();
      onSuccess(receiptId);
    } catch (err: any) {
      if (err.message?.includes('Insufficient gift card balance')) {
        setError('Insufficient gift card balance. Please use a different payment method.');
      } else if (err.message?.includes('Gift card not found')) {
        setError('Gift card not found. Please check the code and try again.');
      } else {
        setError('Payment failed. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Choose your payment method. Remember, all money is fake! 🎮
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-4 bg-accent/20 rounded-lg">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Banknote className="w-5 h-5 text-primary" />
                  <span>Fake Cash</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="giftcard" id="giftcard" />
                <Label htmlFor="giftcard" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Gift className="w-5 h-5 text-primary" />
                  <span>Gift Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Online Credit Card</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'giftcard' && (
            <div className="space-y-2">
              <Label htmlFor="giftCardCode">Gift Card Code</Label>
              <Input
                id="giftCardCode"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                placeholder="Enter gift card code"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <SimulatedCardForm onValidChange={setCardValid} />
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={completeMutation.isPending || giftCardMutation.isPending}
          >
            {completeMutation.isPending || giftCardMutation.isPending
              ? 'Processing...'
              : 'Complete Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
