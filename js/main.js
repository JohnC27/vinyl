document.addEventListener('DOMContentLoaded', () => {
  const closeOpenBlock = document.querySelector('.header__close-open');
  const headerList = document.querySelector('.header__list');
  const closeOpenElems = document.querySelectorAll('.header__close-open-elem')
  const inputCloser = document.querySelector('.header__input-close');
  const input = document.querySelector('.header__search-input');
  const siteList = document.querySelector('.list');
  const cardsBlock = document.querySelector('.main__content');
  const form = document.querySelector('.header__search-form');
  const cartIconWrapper = document.querySelector('.header__cart-icon-wrapper');

  const itemsCookieName = 'itemsCart';

  const openCloseMenu = () => {
    if (headerList.classList.contains('header__list-unactive')) {
      headerList.classList.remove('header__list-unactive')
      siteList.classList.remove('list-unactive')
    } else {
      headerList.classList.add('header__list-unactive')
      siteList.classList.add('list-unactive')
    }
    if (closeOpenBlock.classList.contains('close')) {
      closeOpenBlock.classList.remove('close')
      closeOpenBlock.classList.add('open')
      for (let i = 0; i < closeOpenElems.length; i++) {
        closeOpenElems[i].classList.add('open__elem', `open-elem__${i}`)
        closeOpenElems[i].classList.remove('close__elem', `close-elem__${i}`)
      }
    } else {
      closeOpenBlock.classList.remove('open')
      closeOpenBlock.classList.add('close')
      for (let i = 0; i < closeOpenElems.length; i++) {
        closeOpenElems[i].classList.add('close__elem', `close-elem__${i}`)
        closeOpenElems[i].classList.remove('open__elem', `open-elem__${i}`)
      }
    }
  }

  class Card {
    constructor(cardsBlock, id, img, title, price, genre) {
      this.id = id;
      this.img = img;
      this.title = title;
      this.price = price;
      this.genre = genre;
      this.cardsBlock = cardsBlock;
    };

    _createCard() {
      const card = document.createElement('div');

      card.className = `item item-${this.id} ${this.genre}`;
      card.innerHTML = `<div class="item__img">
        <img src="${this.img}" alt="vyinl record" class="item__img-img">
      </div>
      <div class="item__text">
          <p class="item__title">${this.title}</p>
          <b class="item__price">$${this.price}</b>
          <button type="submit" class="item__btn" data-id="${this.id}">Add to cart</button>
      </div>`
      return card;
    };

    renderCard() {
      this.cardsBlock.appendChild(this._createCard());
    };
  }

  // * DONE
  const renderCards = async() => {
    const cards = await getJsonData('./db.json');

    cards.forEach(item => {
      const card = new Card(cardsBlock, item.id, item.img, item.title, item.price, item.genre);
      card.renderCard();
    });
  };

  const filterCards = async(event) => {
    event.preventDefault();

    const target = event.target;
    if (target.classList.contains('list__link')) {

      const data = await getJsonData('./db.json');
      cardsBlock.innerHTML = '';
      const filteredData = data.filter(item => {
        if (target.dataset.genre === item.genre) {
          return true;
        } else if (target.dataset.genre === 'All') {
          return true;
        }
      });
      filteredData.forEach(item => {
        const card = new Card(item.id, item.img, item.title, item.price, item.genre);
        card.renderCard();
        card.addCard();
      });
    }

  }
  const search = async(event) => {
      event.preventDefault();

      const inputVal = event.target.elements[0].value.trim();
      const data = await getJsonData('./dataBase.json');
      if (inputVal !== '') {
        const searchStr = new RegExp(inputVal, 'i');
        let searchResult = data.filter(item => searchStr.test(item.title));
        cardsBlock.innerHTML = '';
        if (searchResult.length !== 0) {
          searchResult.forEach(item => {
            const card = new Card(item.id, item.img, item.title, item.price, item.genre);
            card.renderCard();
            card.addCard();
          });
          input.value = '';
        } else {
          cardsBlock.innerHTML = `Sorry but we couldn't find anything according to your request`;
          input.value = '';
        }
      } else {
        cardsBlock.innerHTML = '';
        data.forEach(item => {
          const card = new Card(item.id, item.img, item.title, item.price, item.genre);
          card.renderCard();
          card.addCard();
        });
      }
    }
    // * DONE
  const updateCartIcon = cartItemLength => {
    if (cartItemLength === 0) {
      cartIconWrapper.innerHTML = `<svg width="20" height="17" class="header__cart-icon" viewBox="0 0 521 456" fill="none">
          <path d="M520.246 162.749H431.904L339.094 8.06298C334.49
             0.379036 324.503 -2.12974 316.788 2.49048C309.087
              7.1107 306.595 17.0965 311.215 24.7969L393.986 
              162.749H126.261L209.032 24.7958C213.652 17.0955 
              211.16 7.1096 203.459 2.48938C195.727 -2.13084 
              185.773 0.377942 181.153 8.06189L88.3424 
              162.748H0V195.263H35.2859L76.5888 415.584C80.9069 
              438.653 101.07 455.387 124.537 455.387H395.71C419.176 
              455.387 439.339 438.653 443.642 415.6L484.959 195.263H520.247C520.246 
              195.263 520.246 162.749 520.246 162.749ZM411.681 409.615C410.253 
              417.299 403.536 422.872 395.709 422.872H124.537C116.709 422.872 
              109.994 417.3 108.549 409.6L68.3576 195.263H451.889L411.681 409.615Z" fill="black" />
        </svg>`;
    } else {
      cartIconWrapper.innerHTML = `<img src="./img/gif.gif" class="header__cart-icon">`;
    }
  };

  // * DONE
  const addToCookie = (cookieName, cookieValue) => {
    document.cookie = `${cookieName}=${cookieValue}; max-age=86400e3`;
  };

  // * DONE
  const addToCart = (cart, id) => {
    if (cart[id]) {
      cart[id] += 1;
    } else {
      cart[id] = 1;
    }

    addToCookie(itemsCookieName, JSON.stringify(cart));
  };

  renderCards();

  closeOpenBlock.addEventListener('click', openCloseMenu);

  inputCloser.addEventListener('click', () => {
    input.value = '';
  });

  headerList.addEventListener('click', filterCards);

  form.addEventListener('submit', search);

  // * DONE
  document.addEventListener('click', evt => {
    const target = evt.target;

    if (target.closest(".item__btn")) {
      addToCart(window.itemsCart, Number(target.dataset.id));
      updateCartIcon(Object.keys(window.itemsCart).length);
    }
  });
});
