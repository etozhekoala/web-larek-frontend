import { ICard, IAppState, IOrder } from "../types";
import { Model } from "./base/Model";

export class ProductItem extends Model<ICard> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 

export class AppState extends Model<IAppState> {
  catalog: ICard[];
  basket: ICard[];
  order: IOrder | null = { 
    items: [],
    email: '',
    phone: '',
    address: '',
    payment: '',
    total: null,
  }

  async setCatalog(items: ICard[]) {
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
}

