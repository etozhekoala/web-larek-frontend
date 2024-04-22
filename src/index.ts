import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { CatalogItem } from './components/Card';
import { AppState } from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard, IListCards } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const page = new Page(document.body, events);
const appData = new AppState({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

events.on('items:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card: select', item),
    });
    return card.render({
      title: item.title,
      image: CDN_URL + item.image,
      description: item.description,
      price: item.price,
      category: item.category,
    })
  })
})

api
  .get('/product')
  .then((data:IListCards<ICard>) => appData.setCatalog(data.items))
  .catch((err) => {
    console.error(err);
  });