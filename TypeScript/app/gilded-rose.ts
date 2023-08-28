export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality(): Array<Item> {
    return this.items.map((item) => {
      const lower = item.name.toLowerCase();
      let quality = item.quality;

      // Sulfuras are unaffected by sellBy or quality
      if (lower.includes("sulfuras")) return item;

      // is the item past its sellBy date?
      const after = item.sellIn <= 0;

      // "Aged Brie" actually increases in Quality the older it gets and double after sellBy
      if (lower.includes("brie")) quality = safeIncrement(item, after ? 2 : 1);

      // "Backstage passes" increases in Quality at the 10 and 5 day mark and dropd to 0 after sellBy
      else if (lower.includes("backstage pass")) {
        if (after) quality = 0;
        else if (item.sellIn <= 5) quality = safeIncrement(item, 3);
        else if (item.sellIn <= 10) quality = safeIncrement(item, 2);
        else quality = safeIncrement(item, 1);
      }

      // "Conjured" items degrade in Quality twice as fast as normal items
      else if (lower.includes("conjured"))
        quality = safeDecrement(item, after ? 4 : 2);
      // all other items degrade in by 1 before sellBy and 2 after
      else quality = safeDecrement(item, after ? 2 : 1);

      return {
        ...item,
        sellIn: item.sellIn - 1,
        quality,
      };
    });
  }
}

export const safeDecrement = (item: Item, dec: number) =>
  Math.max(0, item.quality - dec);

export const safeIncrement = (item: Item, inc: number) =>
  Math.min(50, item.quality + inc);
