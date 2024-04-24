export interface ICard {
  id: string;
  index?: number;
  description: string;
  image?: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrderForm {
  email: string;
  phone: string;
  address: string;
  payment: string;
  total: number;
  [key: string]: unknown;
}

export interface IOrder extends IOrderForm {
  items: string [];
}

export interface IAppState {
  catalog: ICard[];
  basket: string [];
  order: IOrder | null;

	setCatalog(items: ICard[]): void;

	getPrice(container: ICard[], value: string): string;

	addProduct(item: ICard, container: ICard[]): void;

	clearBasket(container: ICard[]): void;

	setOrder(state: IOrder): void;
}

export interface IListCards<T> {
  total: number;
  items: T[];
}

export interface ITotalItems<T> {
	total: number;
	items: T[];
}

export interface IOrderResult {
	id: string;
	total: number;
}