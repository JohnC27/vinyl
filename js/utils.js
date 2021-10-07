const itemsCookieName = 'itemsCart';

const getJsonData = async url => {
  const response = await fetch(`https://johnc27.github.io/vinyl${url}`);
  const data = await response.json();

  return data;
};

const getCookie = name => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

window.itemsCart = {};
