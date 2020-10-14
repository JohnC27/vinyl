const cartItems = document.querySelector('.cart-items');
const btnBack = document.querySelector('.main__back');
const closes = document.querySelectorAll('.cart-item__close')
const mainBtn = document.querySelector('.main__submit-btn');

// * DONE
const getItemsFromCookie = () => {
  if (getCookie(itemsCookieName)) {
    window.itemsCart = {...window.itemsCart, ...[JSON.parse(getCookie(itemsCookieName))] };
  }
};

// * DONE
class CartItem {
  constructor(container, img, title, price, id) {
    this.img = img;
    this.title = title;
    this.price = price;
    this.id = id;
    this.container = container;
  }
  createItem() {
    const item = document.createElement('div');
    item.className = `cart-item ${this.id}`;
    item.innerHTML = `
      <div class="cart-item__close">
      <svg width="13" height="13" class="cart-item__close-icon ${this.id}" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.97499 5.87994L1.87373 0.778687L0.77832 1.87409L5.87958 6.97535L0.950388 11.9045L2.0458 12.9999L6.97499 8.07076L11.7324 12.8282L12.8278 11.7328L8.07039 6.97535L12.9999 2.04587L11.9045 0.950463L6.97499 5.87994Z" fill="black" />
      </svg>
  </div>
  <div class="cart-item__img">
      <img src="${this.img}" alt="image" class="cart-item__img-img">
              </div>
      <div class="cart-item__text">
          <div class="cart-item__name">
              <b class="cart-item__name-name">${this.title}</b>
          </div>
          <div class="cart-item__price">
              <b class="cart-item__price-price">$${this.price}</b>
          </div>
      </div>`;

    return item;
  }

  renderItem() {
    this.container.appendChild(this.createItem());
  }
}
// * DONE
const showFilteredBasket = async() => {
  const data = await getJsonData('/js/db.json');

  const filteredData = data.filter(item => itemsCart.hasOwnProperty(item.id));

  filteredData.forEach(item => {
    const card = new CartItem(cartItems, item.img, item.title, item.price, item.id);
    card.renderItem();
  });
};

const removeItems = async(id, evt) => {
  delete itemsCart[id]
  document.cookie = `itemsCart=${JSON.stringify(itemsCart)}; max-age=86400e3`;

  const thisDeleted = evt.path[2]
  thisDeleted.remove();
}

const closeCarts = (evt) => {
  const target = evt.target;

  if (target.closest('.cart-item__close-icon')) {
    removeItems(target.classList[1], evt);
    if (Object.keys(itemsCart).length == 0) {
      cartItems.innerHTML = 'You have nothing in the your cart';
      mainBtn.style.backgroundColor = 'lightgrey'
    }
  }
}

mainBtn.addEventListener('click', () => {
  alert('You have made a fake order.');
});

if (Object.keys(itemsCart).length === 0) {
  cartItems.innerHTML = 'You have nothing in the your cart';
  mainBtn.style.backgroundColor = 'lightgrey'
} else {
  document.addEventListener('click', closeCarts);
}

// * DONE

const initCart = () => {
  getItemsFromCookie();
  showFilteredBasket();
};

initCart();