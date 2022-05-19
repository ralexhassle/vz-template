/* eslint-disable class-methods-use-this */
import Domain from "./Domain";

import { MENU } from "./seed";

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Menu extends Domain {
  public async getMenu() {
    return new Promise<API.Menu>((resolve) => {
      setTimeout(() => {
        resolve(MENU);
      }, 1000);
    });
  }

  public async postProduct(product: API.PostProduct) {
    return new Promise<API.Product>((resolve) => {
      setTimeout(() => {
        resolve({
          ...product,
          productId: random(10000, 99999),
        });
      }, 3000);
    });
  }

  public async postCategory(category: API.PostCategory) {
    return new Promise<API.Category>((resolve) => {
      setTimeout(() => {
        resolve({
          ...category,
          categoryId: random(10000, 99999),
        });
      }, 1000);
    });
  }
}

export default Menu;
