import { Item, GildedRose, } from "@/gilded-rose";

/**
 * @description creates a new GildedRose instance with the given item and updates it once
 */
const updateItem = (item: Item): Item => {
  const gildedRose = new GildedRose([item]);
  const items = gildedRose.updateQuality();
  return items[0];
};

describe("Gilded Rose", () => {
  describe("- Standard Items", () => {
    const standard = "+5 Dexterity Vest";
    it("should decrement standard items by 1 prior to the Sellby", () => {
      const item = new Item(standard, 10, 20);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(standard, 9, 19));
    });
    it("should decrement standard items by 2 after the Sellby", () => {
      const item = new Item(standard, 0, 10);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(standard, -1, 8));
    });
    it("should never go negative", () => {
      const item = new Item(standard, 10, 0);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(standard, 9, 0));
    });
  });

  describe("- Aged Brie", () => {
    const brie = "Aged Brie";

    it("should increment Aged Brie by 1 prior to the Sellby", () => {
      const item = new Item(brie, 2, 0);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(brie, 1, 1));
    });
    it("should increment Aged Brie by 2 after the Sellby ", () => {
      const item = new Item(brie, -2, 0);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(brie, -3, 2));
    });

    it("should never exceed 50", () => {
      const item = new Item(brie, -2, 50);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(brie, -3, 50));
    });
  });

  describe("- Sulfuras", () => {
    const sulfuras = "Sulfuras, Hand of Ragnaros";
    it("should have benign SellBy for Sulfuras which remain at Quality of 80 ", () => {
      // after Sellby
      const item1 = new Item(sulfuras, -1, 80);
      const updated1 = updateItem(item1);
      expect(updated1).toEqual(new Item(sulfuras, -1, 80));

      // before Sellby
      const item2 = new Item(sulfuras, 10, 80);
      const updated2 = updateItem(item2);
      expect(updated2).toEqual(new Item(sulfuras, 10, 80));
    });
  });

  describe("- Backstage Passes", () => {
    const pass = "Backstage passes to a TAFKAL80ETC concert"

    it("should increment Backstage Passes by 1 when > 10 days out", () => {
      const item = new Item(pass, 20, 10);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(pass, 19, 11));
    });
    it("should increment Backstage Passes by 2 when 5 - 10 days out", () => {
      const item = new Item(pass, 9, 10);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(pass, 8, 12));
    });
    it("should increment Backstage Passes by 3 when < 5 days out", () => {
      const item = new Item(pass, 2, 10);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(pass, 1, 13));
    });
    it("should drop to 0 after SellBy", () => {
      const item = new Item(pass, 0, 10);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(pass, -1, 0));
    });
    it("should not exceed 50", () => {
      const item = new Item(pass, 2, 50);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(pass, 1, 50));
    });

  });
  describe("- Conjured Items", () => {
    const conjured = "Conjured Mana Cake"

    it("should decrement Conjured items by 2 prior to the Sellby", () => {
      const item = new Item(conjured, 10, 15);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(conjured, 9, 13));
    });

    it("should decrement Conjured items by 4 after the Sellby", () => {
      const item = new Item(conjured, -2, 8);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(conjured, -3, 4));
    });

    it("should never go negative", () => {
      const item = new Item(conjured, 10, 0);
      const updated = updateItem(item);
      expect(updated).toEqual(new Item(conjured, 9, 0));
    });

  });
});
