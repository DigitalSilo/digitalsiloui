import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService<T> {
  private elements: Array<T>;

  constructor() { 
    this.elements = [];
  }

  public get length(): number {
    return this.elements.length;
  }

  public get items() : Array<T> {
    return this.elements;
  }

  public add(value: T): void {
    this.elements.push(value);
  }

  public get(index: number): T {
    return this.elements[index];
  }

  public remove(condition: (itemToRemove?: T) => boolean): void {
    for (let index = 0; index < this.length; index++) {
      if(condition(this.get(index))){
        this.elements.splice(index, 1);
      }
    }
  }

  public groupBy<K>(getKey: (item: T) => K) {
        const map = new Map<K, Array<T>>();
        this.elements.forEach((item) => {
            const key = getKey(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        var groupedArray = Array.from(map.values());
        return groupedArray;
  }

  public reset() : void {
    this.elements.length = 0;
  }
}