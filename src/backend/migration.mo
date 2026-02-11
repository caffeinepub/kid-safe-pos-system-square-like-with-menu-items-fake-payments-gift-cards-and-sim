import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type OldMenuItem = {
    name : Text;
    price : Float;
    category : ?Text;
  };

  type OldTransaction = {
    items : [OldMenuItem];
    total : Float;
    timestamp : Int;
    paymentMethod : Text;
  };

  type OldGiftCard = {
    code : Text;
    balance : Float;
  };

  type OldActor = {
    menu : List.List<OldMenuItem>;
    transactions : List.List<OldTransaction>;
    giftCards : Map.Map<Text, OldGiftCard>;
  };

  type NewActor = {
    menu : List.List<OldMenuItem>;
    transactions : List.List<OldTransaction>;
    giftCards : Map.Map<Text, OldGiftCard>;
    customCreditCards : Map.Map<Text, { identifier : Text; qrPayload : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    { old with customCreditCards = Map.empty<Text, { identifier : Text; qrPayload : Text }>() };
  };
};
