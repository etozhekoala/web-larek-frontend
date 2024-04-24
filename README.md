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

### 1. class ProductItem 
  
  Реализуется от class Model.<br>
  
  Конструктор принимает следующие аргументы:
  - id: string;
  - title: string;
  - description: string;
  - category: string;
  - image: string;
  - price: number | null.

### 2. class BasketItem
  
  Имеет следующие свойства:
  *id: string;
  *title: string;
  *price: number | null.

### 3. class OrderForm
  
  Имеет свойство address: string;

### 4. class ContactsForm
  
  Имеет следующие свойства:
  *email: string;
  *phone: string.

### 5. class OrderResult

  Имеет свойство  id: string.

### 6. class AppState
  
  Реализуется от class Model.
  Предназначен для хранения актуального состояния приложения.
  Имеет следующие  методы:
  *clearBasket;
  *getTotal;
  *setCatalog;
  *setPreview;
  *setOrderFields;
  *validateOrder.

## Компоненты представления

### 1. class Modal

  Предназначен для работы модального окна.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_closeButton;
  *_content.
  Имеет следующие методы:
  *open - открытие;
  *close - закрытие;
  *render - для отрисовки.
  Также имеет сеттер для установки контента.

### 2. class Form

  Предназначен для работы с формами.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_submit;
  *_errors;
  Имеет сеттеры, необходимые для валидности полей:
  *valid;
  *errors;
  Имеет метод:
  *render.

### 3. class Basket 

  Предназначен для работы с корзиной.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_list;
  *_total;
  Имеет сеттеры:
  *items;
  *selected;
  *total.

### 4. class Tabs 

  Предназначен для работы со способами оплаты.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_buttons.
  Имеет сеттер:
  *selected.

### 5. class Success 

  Предназначен для отображения окончания оплаты.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_close.

### 6. class Card 

  Предназначен для отображения карточки товара.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_title;
  *_image;
  *_button;
  *_descriprion;
  Имеет сеттеры:
  *id;
  *title;
  *image;
  *description.
  Имеет геттеры:
  *id;
  *title.

### 7. class Order 

  Предназначен для отображения форм.
  Конструктор принимает данные, наследуемые от class Form, а также имеет сеттеры:
  *phone;
  *email.

### 8. class Page 

  Предназначен для отображения данных на начальной странице.
  Конструктор принимает данные, наследуемые от class Component, а также:
  *_counter;
  *_catalog;
  *_basket.
  Имеет сеттеры:
  *counter;
  *catalog.