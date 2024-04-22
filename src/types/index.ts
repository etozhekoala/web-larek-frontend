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
}

export interface IListCards<T> {
  total: number;
  items: T[];
}