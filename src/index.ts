import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, catalogValue } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { CatalogItem } from './components/Card';
import { ProductItem } from './components/AppData';
import { AppState } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard, IListCards, IOrderResult } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();

const api = new Api(API_URL);
const page = new Page(document.body, events);
const appData = new AppState({}, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const selectedCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basket = new Basket(cloneTemplate(basketTemplate), events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

const address = new Order(cloneTemplate(orderTemplate), events);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contacts = new Order(cloneTemplate(contactsTemplate), events);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('card:select', (item: ProductItem) => {
	const card = new CatalogItem(cloneTemplate(selectedCardTemplate), {
		onClick: (event) => {
			item.price !== null
				? events.emit('basket:change', item)
				: events.emit('basket:change');
		},
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
	card.checkInBasket(item, basket.selected);
});

events.on('basket:change', (item: ProductItem | null) => {

	const cardTemplate = new CatalogItem(cloneTemplate(basketCardTemplate), {
		onClick: (event) => events.emit('basket:delete', item),
	});

	if (item !== null) {
		cardTemplate.render({
			id: item.id,
			title: item.title,
			price: item.price,
		});
		appData.addProduct(cardTemplate, basket.selected);
		modal.close();
	} else {
		events.emit('basket:render');
	}

	page.render({
		counter: basket.selected.length,
	});
});

events.on ('basket:render', () => {
	modal.render({
		content: basket.render({
			items: basket.selected.map((element, index) => {
				return element.render({
					index: index + 1,
				});
			}),
			price: appData.getPrice(basket.selected, catalogValue),
		}),
	});
});

events.on('basket:delete', (item: ProductItem) => {
	basket.selected = basket.selected.filter((element) => {
		return element.id !== item.id;
	});
	events.emit('basket:change', null);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('address:render', () => {
	modal.render({
		content: address.render({
			valid: address.valid,
			errors: address.errors,
			address: '',
		}),
	});
});

events.on('contacts:render', () => {
	modal.render({
		content: contacts.render({
			valid: contacts.valid,
			errors: contacts.errors,
			email: '',
			phone: '',
		}),
	});
	contacts.order.payment = address.order.payment;
});

events.on('data:set', () => {
	let items: string[] = [];
	basket.selected.forEach((element) => {
		items.push(element.id);
	});

	appData.setOrder({
		address: address.order.payment,
		payment: address.order.payment,
		phone: contacts.order.phone,
		items: items,
		email: contacts.order.email,
		total: parseInt(basket.total),
	});
});

events.on('order:submit', () => {
	const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			appData.clearBasket(basket.selected);
			events.emit('basket:change', null);
			modal.close();
		},
	});

	modal.render({
		content: success.render({
			total: basket.price,
		}),
	});
});

events.on('order:post', () => {
	events.emit('data:set');

	api
		.post('/order', appData.order)
		.then((data: IOrderResult) => data)
		.then(() => {
			events.emit('order:submit');
		})
		.catch((result) => {
			modal.close();
			console.error(result);
		});
});


api
  .get('/product')
  .then((data:IListCards<ICard>) => appData.setCatalog(data.items))
  .catch((err) => {
    console.error(err);
  });