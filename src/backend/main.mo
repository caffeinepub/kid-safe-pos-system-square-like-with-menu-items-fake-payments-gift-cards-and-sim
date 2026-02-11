import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type MenuItem = {
    name : Text;
    price : Float;
    category : ?Text;
  };

  type Transaction = {
    items : [MenuItem];
    total : Float;
    timestamp : Time.Time;
    paymentMethod : Text;
  };

  type GiftCard = {
    code : Text;
    balance : Float;
  };

  type CustomCreditCard = {
    identifier : Text;
    qrPayload : Text;
  };

  module MenuItem {
    public func compare(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };

    public func compareByCategory(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      switch (item1.category, item2.category) {
        case (null, null) { #equal };
        case (null, ?_) { #less };
        case (?_, null) { #greater };
        case (?cat1, ?cat2) { Text.compare(cat1, cat2) };
      };
    };
  };

  let menu = List.empty<MenuItem>();
  let transactions = List.empty<Transaction>();
  let giftCards = Map.empty<Text, GiftCard>();
  let customCreditCards = Map.empty<Text, CustomCreditCard>();

  public shared ({ caller }) func addMenuItem(name : Text, price : Float, category : ?Text) : async () {
    if (price < 0) {
      Runtime.trap("Price cannot be negative");
    };
    let newItem : MenuItem = {
      name;
      price;
      category;
    };
    menu.add(newItem);
  };

  public shared ({ caller }) func editMenuItem(index : Nat, name : Text, price : Float, category : ?Text) : async () {
    if (price < 0) {
      Runtime.trap("Price cannot be negative");
    };
    let newItem : MenuItem = {
      name;
      price;
      category;
    };
    let tempList = List.empty<MenuItem>();

    var currentIndex = 0;
    let iter = menu.values();
    var it = iter.next();
    while (it != null) {
      switch (it) {
        case (null) {};
        case (?item) {
          if (currentIndex == index) {
            tempList.add(newItem);
          } else {
            tempList.add(item);
          };
          currentIndex += 1;
        };
      };
      it := iter.next();
    };

    menu.clear();
    let newItemsIter = tempList.values();
    var newItemsIt = newItemsIter.next();
    while (newItemsIt != null) {
      switch (newItemsIt) {
        case (null) {};
        case (?item) {
          menu.add(item);
        };
      };
      newItemsIt := newItemsIter.next();
    };
  };

  public shared ({ caller }) func removeMenuItem(index : Nat) : async () {
    let tempList = List.empty<MenuItem>();

    var currentIndex = 0;
    let iter = menu.values();
    var it = iter.next();
    while (it != null) {
      switch (it) {
        case (null) {};
        case (?item) {
          if (currentIndex != index) {
            tempList.add(item);
          };
          currentIndex += 1;
        };
      };
      it := iter.next();
    };

    menu.clear();
    let newItemsIter = tempList.values();
    var newItemsIt = newItemsIter.next();
    while (newItemsIt != null) {
      switch (newItemsIt) {
        case (null) {};
        case (?item) {
          menu.add(item);
        };
      };
      newItemsIt := newItemsIter.next();
    };
  };

  public query ({ caller }) func getMenu() : async [MenuItem] {
    menu.toArray().sort();
  };

  public query ({ caller }) func getMenuByCategory() : async [MenuItem] {
    menu.toArray().sort(MenuItem.compareByCategory);
  };

  public shared ({ caller }) func completeTransaction(items : [MenuItem], total : Float, paymentMethod : Text) : async () {
    let transaction : Transaction = {
      items;
      total;
      timestamp = Time.now();
      paymentMethod;
    };
    transactions.add(transaction);
  };

  public shared ({ caller }) func issueGiftCard(code : Text, balance : Float) : async () {
    if (giftCards.containsKey(code)) {
      Runtime.trap("Gift card code already exists");
    };
    let newCard : GiftCard = {
      code;
      balance;
    };
    giftCards.add(code, newCard);
  };

  public query ({ caller }) func getGiftCard(code : Text) : async GiftCard {
    switch (giftCards.get(code)) {
      case (null) { Runtime.trap("Gift card not found. ") };
      case (?card) { card };
    };
  };

  public shared ({ caller }) func useGiftCard(code : Text, amount : Float) : async () {
    switch (giftCards.get(code)) {
      case (null) { Runtime.trap("Gift card not found. ") };
      case (?card) {
        if (card.balance < amount) {
          Runtime.trap("Insufficient gift card balance");
        };
        let updatedCard : GiftCard = {
          code;
          balance = card.balance - amount;
        };
        giftCards.add(code, updatedCard);
      };
    };
  };

  public shared ({ caller }) func addCustomCreditCard(identifier : Text, qrPayload : Text) : async () {
    if (customCreditCards.containsKey(identifier)) {
      Runtime.trap("Credit card identifier already exists");
    };
    let newCard : CustomCreditCard = {
      identifier;
      qrPayload;
    };
    customCreditCards.add(identifier, newCard);
  };

  public query ({ caller }) func validateCustomCreditCard(qrPayload : Text) : async Text {
    let matchingCard = customCreditCards.toArray().find(
      func((_, card)) {
        card.qrPayload == qrPayload;
      }
    );

    switch (matchingCard) {
      case (null) { Runtime.trap("Invalid credit card") };
      case (?(_, card)) { card.identifier };
    };
  };
};

