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

  public removeAt(condition: (itemToRemove?: T) => boolean): void {
    for (let index = 0; index < this.length; index++) {
      if(condition(this.get(index))){
        this.elements.splice(index, 1);
      }
    }
  }
}