/* eslint-disable class-methods-use-this */
import Domain from "./Domain";

import SEED from "./seed";

class Menu extends Domain {
  public async getMenu() {
    return new Promise<API.Menu>((resolve) => {
      setTimeout(() => {
        resolve(SEED);
      }, 1000);
    });
  }
}

export default Menu;
