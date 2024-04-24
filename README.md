# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Архитектура

## Базовый код

### 1. class API<br>
  Реализует взаимодействие с сервером. Конструктор принимает следующие аргументы:
  
  - ```baseURL: string``` - запрос для URL;
  - ```options: RequestInit = {}``` - опции запроса для доступа к серверу.

  class API имеет следующие методы:
  - ```handleResponse(response: Response): Promise<object>``` - используется для обработки ответа сервера;
  - ```get(uri: string)``` - используется для получения ответа сервера;
  - ```post(uri: string, data: object, method: ApiPostMethods = 'POST')``` - используется для отправки данных на сервер.<br>
  
### 2. class EventEmitter<br>

  Предоставляет возможность подписаться на все события или слушать их. Имеет свойство:

  - ```_events: Map<EventName, Set<Subscriber>>.```<br>
  
  Имеет следующие методы:
  
  - ```on<T extends object>(eventName: EventName, callback: (event: T) => void)``` - Устанавливает обработчик на событие;
  - ```off(eventName: EventName, callback: Subscriber)``` - снимает обработчик с события;
  - ```emit<T extends object>(eventName: string, data?: T)``` - инициирует событие с данными;
  - ```onAll(callback: (event: EmitterEvent) => void)``` - слушает все события;
  - ```offAll()``` - сбрасывает все события;
  - ```trigger<T extends object>(eventName: string, context?: Partial)<T>``` - делает коллбек триггер, генерирующий событие при вызов.<br>

  Имеет интерфейс:
  
   ```ts
    interface IEvents {
        on(event: string, callback: (data: T) => void): void;
        emit(event: string, data?: T): void;
        trigger(event: string, context?: Partial): (data: T) => void; 
    }
```

### 3. class Component
  
  Отрисовывает интерфейс для взаимодейтсивя с DOM-элементами. Является абстрактным классом.<br>
  
  Имеет следующие методы:<br>

  переключает класс элемента:

  ```ts
    toggleClass(element:HTMLElement, className: string, force?: boolean) {
      element.classList.toggle(className, force);
    }
  ```

  устанавливает текст элементу:
  
  ```ts
    protected setText(element: HTMLElement, value: unknown) {
    if(element) {
      element.textContent = String(value);
    }
  }
  ```

  устанавливает блокировку для элемента:

   ```ts
    setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'true');
			else element.removeAttribute('disabled');
		}
	}
  ```
  
  скрывает элемент:

  ```ts
    protected setHidden(element: HTMLElement) {
    element.style.display = 'none';
  }
  ```

  показывает элемент:

  ```ts
    protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}
  ```

  добавляет изображение и альтернативный текст элементу:

  ```ts
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }
  ```

  отрисовывает элемент:

  ```ts
    render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
  ```

### 4. class Model
  
  Является абстрактным классом и предназначен для создания данных модели.<br>
  Использует метод ```emitChanges(event: string, payload?: object)``` для уведомления об изменениях.<br>
  Данные модели и events используются в конструкторе при взаимодействии с EventEmitter.

## Компоненты модели данных 

### 1. class AppData

  Собирает данные с компонентов и реализует основные методы работы с данными.<br>
  Имеет следующие методы:<br>

  заполение каталога:

  ```ts
    async setCatalog(items: ICard[]) {
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
  ```

  получение цены продукта в корзине:

  ```ts
    async setCatalog(items: ICard[]) {
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }
  ```

  получение цены продукта в корзине:

  ```ts
    getPrice(container: CatalogItem[], value: string): string {
		let totalAmount = 0;

		for (let i = 0; i < container.length; i++) {
			const current = container[i];
			totalAmount += current.price;
		}
		return totalAmount + value;
	}
  ```

  добавление продукта:

  ```ts
    addProduct(item: CatalogItem, container: CatalogItem[]) {
		if (item) {
			container.push(item);
		}
	}
  ```

  очистка корзины:

  ```ts
    clearBasket(container: CatalogItem[]) {
		container.length = 0;
	}
  ```

  передает данные перед отправкой заказа:

  ```ts
    setOrder(state: IOrder) {
		this.order = Object.assign(this.order, state);
	}
  ```

### 2. class ProductItem 
  
  Реализуется от class Model.<br>
  
  Конструктор принимает следующие аргументы:
  - ```id: string;```
  - ```title: string;```
  - ```description: string;```
  - ```category: string;```
  - ```image: string;```
  - ```price: number | null.```

### 3. class BasketItem
  
  Имеет следующие свойства:
  - ```id: string;```
  - ```title: string;```
  - ```price: number | null.```

### 4. class OrderForm
  
  Имеет свойство 
  ```address: string;```

### 5. class ContactsForm
  
  Имеет следующие свойства:
  - ```email: string;```
  - ```phone: string.```

### 6. class OrderResult

  Имеет свойство  
  ```id: string.```

### 7. class AppState
  
  Реализуется от class Model.
  Предназначен для хранения актуального состояния приложения.
  Имеет следующие  методы:
  - ```clearBasket;```
  - ```getTotal;```
  - ```setCatalog;```
  - ```setPreview;```
  - ```setOrderFields;```
  - ```validateOrder.```

## Компоненты представления

### 1. class Modal

  Предназначен для работы модального окна.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_closeButton;```
  - ```_content.```
  Имеет следующие методы:
  - ```open - открытие;```
  - ```close - закрытие;```
  - ```render - для отрисовки.```
  Также имеет сеттер для установки контента.

### 2. class Form

  Предназначен для работы с формами.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_submit;```
  - ```_errors;```
  Имеет сеттеры, необходимые для валидности полей:
  - ```valid;```
  - ```errors;```
  Имеет метод:
  - ```render.```

### 3. class Basket 

  Предназначен для работы с корзиной.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_list;```
  - ```_total;```
  Имеет сеттеры:
  - ```items;```
  - ```selected;```
  - ```total.```

### 4. class Tabs 

  Предназначен для работы со способами оплаты.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_buttons.```
  Имеет сеттер:
  - ```selected.```

### 5. class Success 

  Предназначен для отображения окончания оплаты.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_close.```

### 6. class Card 

  Предназначен для отображения карточки товара.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_title;```
  - ```_image;```
  - ```_button;```
  - ```_descriprion;```
  Имеет сеттеры:
  - ```id;```
  - ```title;```
  - ```image;```
  - ```description.```
  Имеет геттеры:
  - ```id;```
  - ```title.```

### 7. class Order 

  Предназначен для отображения форм.
  Конструктор принимает данные, наследуемые от class Form, а также имеет сеттеры:
  - ```phone;```
  - ```email.```

### 8. class Page 

  Предназначен для отображения данных на начальной странице.
  Конструктор принимает данные, наследуемые от class Component, а также:
  - ```_counter;```
  - ```_catalog;```
  - ```_basket.```
  Имеет сеттеры:
  - ```counter;```
  - ```catalog.```

## Типы данных

- Интерфейс страницы

  ```ts
    interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
  }
  ```

  - Интерфейс карточки

  ```ts
    export interface ICard {

      id: string;
      index?: number;
      description: string;
      image?: string;
      title: string;
      category: string;
      price: number | null;
    }
  ```

  - Интерфейс формы заказа

  ```ts
    export interface IOrderForm {
      email: string;
      phone: string;
      address: string;
      payment: string;
      total: number;
      [key: string]: unknown; // позволяет использовать динамический ключ
    }
  ```

  - Интерфейс объектов для заказа

  ```ts
    export interface IOrder extends IOrderForm {
      items: string[];
    }
  ```

  - Интерфейс описания состояния приложения

  ```ts
    export interface IAppState {
      catalog: IProductItem[];
      basket: string[];
      preview: string | null;
      order: IOrderForm | null;
      loading: boolean;
  }
  ```

  Имеет такие свойства, как:<br>
  - Добавить элементы в каталог ```setCatalog(items: ICard[]): void;```
  - Получить цену в корзине ```getPrice(container: ICard[], value: string): string;```
  - Добавить товар ```addProduct(item: ICard, container: ICard[]): void;```
  - Очистить корзину ```clearBasket(container: ICard[]): void;```
  - Передать данные перед отправкой заказа ```setOrder(state: IOrder): void;```<br>

  - Интерфейс карточек

  ```ts
    export interface IListCards<T> {
      total: number;
      items: T[];
    }
  ``` 

  - Интерфейс получения элементов страницы

  ```ts
    interface ITotalItems<T> {
      total: number;
      items: T[];
    }
  ```

   - Интерфейс данных для заказа

  ```ts
    interface IOrderResult {
      id: string;
      total: number;
    }
  ``` 