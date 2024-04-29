import { CatalogItem } from "../Card";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";
import { ensureElement, createElement } from "../../utils/utils";

interface IBasketView {
  items: HTMLElement[];
  price: string;
  selected: CatalogItem[];
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;

	selected: CatalogItem[];
	total: string;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('address:render');
			});
		}

		this.selected = [];
		this.total = '';
	}

  protected setButtonStatus(price: string) {
    parseInt(price) === 0
      ? this.setDisabled(this._button, true)
      : this.setDisabled(this._button, false);
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        })
      )
    }
  }

  set price(price: string) {
    this.setText(this._price, price);
    this.setButtonStatus(price);
    this.total = price;
  }

  get price(): string {
    return this.total;
  }
}