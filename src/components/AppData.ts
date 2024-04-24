import { ICard, IAppState, IOrder } from "../types";
import { CatalogItem } from "./Card";
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

  getPrice(container: CatalogItem[], value: string): string {
		let totalAmount = 0;

		for (let i = 0; i < container.length; i++) {
			const current = container[i];
			totalAmount += current.price;
		}
		return totalAmount + value;
	}

  addProduct(item: CatalogItem, container: CatalogItem[]) {
		if (item) {
			container.push(item);
		}
	}

  clearBasket(container: CatalogItem[]) {
		container.length = 0;
	}

  setOrder(state: IOrder) {
		this.order = Object.assign(this.order, state);
	}
}

