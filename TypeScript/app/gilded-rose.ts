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

  updateQuality():Array<Item> {
    this.items.forEach((item) => {
      console.log('hi');

      const lowerName = item.name.toLowerCase();

      // Sulfuras are unaffected by sellBy or quality
      if (lowerName.includes("sulfuras")) return;

      // is the item past its sellBy date?
      const after = item.sellIn <= 0;

      // decrement sellIn
      item.sellIn--;

      // "Aged Brie" actually increases in Quality the older it gets and double after sellBy
      if (lowerName.includes("brie"))
        item.quality = safeIncrement(item, after ? 2 : 1);
      

      // "Backstage passes" increases in Quality at the 10 and 5 day mark and dropd to 0 after sellBy
      else if (lowerName.includes("backstage pass")) {
        if (after) item.quality = 0;
        else if (item.sellIn <= 5) item.quality = safeIncrement(item, 3);
        else if (item.sellIn <= 10) item.quality = safeIncrement(item, 2);
        else item.quality = safeIncrement(item, 1);
      }

      // "Conjured" items degrade in Quality twice as fast as normal items
      else if (lowerName.includes("conjured")){
        
        item.quality = safeDecrement(item, after ? 4 : 2);
      }

      // all other items degrade in by 1 before sellBy and 2 after
      else item.quality = safeDecrement(item, after ? 2 : 1);

      
    });

    return this.items;
  }
}

export const safeDecrement = (item: Item, dec: number) =>
  Math.max(0, item.quality - dec);

export const safeIncrement = (item: Item, inc: number) =>
  Math.min(50, item.quality + inc);
