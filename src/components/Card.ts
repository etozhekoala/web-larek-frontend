import { Component } from "./base/Component";
import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { categoryMap, catalogValue } from "../utils/constants";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
  protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions,
  ) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);

    container.querySelector(`.${blockName}__image`)
      ? (this._image = ensureElement<HTMLImageElement> (
        `.${blockName}__image`,
        container
      ))
      :null;

      this._index = container.querySelector(`.${blockName}__index`);
      this._button = container.querySelector(`.${blockName}__button`);
      this._description = container.querySelector(`.${blockName}__text`);
      this._price = container.querySelector(`.${blockName}__price`);
      this._category = container.querySelector(`.${blockName}__category`);

      if(actions?.onClick) {
        if (this._button) {
          this._button.addEventListener('click', actions.onClick);
        } else {
          container.addEventListener('click', actions.onClick);
        }
      }
    }

    set index(value: string) {
      this.setText(this._index, value);
    }

    set id(value: string) {
      this.container.dataset.id = value;
    }

    get id(): string {
      return this.container.dataset.id || '';
    }

    set title(value: string) {
      this.setText(this._title, value);
    }

    get title(): string {
      return this._title.textContent || '';
    }

    set price(value: number | null) {
      if (value) {
        this.setText(this._price, value + catalogValue);
      } else {
        this.setText(this._price, "Бесценно");
        this._button ? this.setHidden(this._button) : null;
      }
    }

    get price(): number {
      return parseInt(this._price.textContent);
    }

    set category(value: string) {
      const categoryClassName = 'card__category_';
      this.setText(this._category, value);
      this.toggleClass(
        this._category,
        categoryClassName + categoryMap.get(value)
      );
    }

    set image(value: string) {
      this.setImage(this._image, value, this.title);
    }

    set description(value: string) {
      this.setText(this._description, value);
    }
  }

export class CatalogItem extends Card {
  constructor(container: HTMLElement, actions?:ICardActions) {
    super('card', container, actions);
  }
}