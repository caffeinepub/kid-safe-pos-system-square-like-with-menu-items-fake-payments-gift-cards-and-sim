import { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRCodeBadge from './QRCodeBadge';
import { useCustomCreditCards } from '@/hooks/useCustomCreditCards';

interface StoredCard {
  identifier: string;
  qrPayload: string;
}

export default function CustomCreditCardsScreen() {
  const [cardName, setCardName] = useState('');
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { addCard, isAddingCard } = useCustomCreditCards();

  const generateToken = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `card-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleCreateCard = async () => {
    setError('');

    if (!cardName.trim()) {
      setError('Please enter a card name');
      return;
    }

    const existingCard = cards.find(
      (c) => c.identifier.toLowerCase() === cardName.trim().toLowerCase()
    );
    if (existingCard) {
      setError('A card with this name already exists');
      return;
    }

    try {
      const qrPayload = generateToken();
      await addCard({ identifier: cardName.trim(), qrPayload });

      setCards([...cards, { identifier: cardName.trim(), qrPayload }]);
      setCardName('');
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        setError('A card with this name already exists');
      } else {
        setError('Failed to create card. Please try again.');
      }
    }
  };

  const handleDeleteCard = (identifier: string) => {
    setCards(cards.filter((c) => c.identifier !== identifier));
    setDeleteCardId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Custom Credit Cards
          </CardTitle>
          <CardDescription>
            Create custom credit cards with QR codes for easy scanning at checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g., My Blue Card"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateCard();
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateCard} disabled={isAddingCard}>
                <Plus className="w-4 h-4 mr-2" />
                {isAddingCard ? 'Creating...' : 'Create Card'}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              No custom credit cards yet. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.identifier} className="relative">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="truncate">{card.identifier}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteCardId(card.identifier)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <QRCodeBadge value={card.qrPayload} size={180} showValue={false} />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Scan this QR code at checkout
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteCardId !== null} onOpenChange={(open) => !open && setDeleteCardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCardId}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCardId && handleDeleteCard(deleteCardId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
