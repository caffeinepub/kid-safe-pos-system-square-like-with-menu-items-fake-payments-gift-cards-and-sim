import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SavedCard = {
  id: string;
  name: string;
  number: string; // full 16 digits stored
  expiry: string;
  cvv: string;
};

const STORAGE_KEY = "saved_credit_cards";

const CARD_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-rose-500 to-pink-700",
  "from-emerald-500 to-teal-700",
  "from-orange-500 to-amber-600",
];

export default function CreditCardsScreen() {
  const [cards, setCards] = useState<SavedCard[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const formatNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleAdd = () => {
    const raw = number.replace(/\s/g, "");
    if (!name.trim()) {
      toast.error("Please enter cardholder name");
      return;
    }
    if (raw.length !== 16) {
      toast.error("Card number must be 16 digits");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Expiry must be MM/YY");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      toast.error("CVV must be 3 digits");
      return;
    }

    const card: SavedCard = {
      id: Date.now().toString(),
      name: name.trim(),
      number: raw,
      expiry,
      cvv,
    };
    setCards((prev) => [...prev, card]);
    setName("");
    setNumber("");
    setExpiry("");
    setCvv("");
    setShowForm(false);
    toast.success("Card added! 🎉");
  };

  const handleDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast.success("Card removed");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Credit Cards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fake Cards for Fun 🎮 — for practice only!
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2"
          data-ocid="creditcards.open_modal_button"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Card"}
        </Button>
      </div>

      {/* Add Card Form */}
      {showForm && (
        <div
          className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm"
          data-ocid="creditcards.panel"
        >
          <h2 className="font-semibold text-foreground mb-4">
            New Fake Card ✨
          </h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="cc-name">Cardholder Name</Label>
              <Input
                id="cc-name"
                placeholder="e.g. Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                data-ocid="creditcards.input"
              />
            </div>
            <div>
              <Label htmlFor="cc-number">Card Number</Label>
              <Input
                id="cc-number"
                placeholder="1234 5678 9012 3456"
                value={number}
                onChange={(e) => setNumber(formatNumber(e.target.value))}
                maxLength={19}
                className="mt-1 font-mono tracking-wider"
                data-ocid="creditcards.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cc-expiry">Expiry (MM/YY)</Label>
                <Input
                  id="cc-expiry"
                  placeholder="12/28"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="mt-1"
                  data-ocid="creditcards.input"
                />
              </div>
              <div>
                <Label htmlFor="cc-cvv">CVV</Label>
                <Input
                  id="cc-cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  maxLength={3}
                  className="mt-1"
                  data-ocid="creditcards.input"
                />
              </div>
            </div>
            <Button
              onClick={handleAdd}
              className="w-full"
              data-ocid="creditcards.submit_button"
            >
              Save Card 💳
            </Button>
          </div>
        </div>
      )}

      {/* Cards List */}
      {cards.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="creditcards.empty_state"
        >
          <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No cards yet!</p>
          <p className="text-sm mt-1">Add a fake card to get started 🚀</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card, idx) => {
            const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
            const last4 = card.number.slice(-4);
            const ocidIdx = idx + 1;
            return (
              <div
                key={card.id}
                className={`relative rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg overflow-hidden`}
                data-ocid={`creditcards.item.${ocidIdx}`}
              >
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">💳</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                      data-ocid={`creditcards.delete_button.${ocidIdx}`}
                      aria-label="Remove card"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="font-mono text-lg tracking-widest mb-3">
                    •••• •••• •••• {last4}
                  </p>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/70 uppercase tracking-wide">
                        Cardholder
                      </p>
                      <p className="font-semibold">{card.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70 uppercase tracking-wide">
                        Expires
                      </p>
                      <p className="font-semibold">{card.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
