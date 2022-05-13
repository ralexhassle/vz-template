/* eslint-disable class-methods-use-this */
import Domain from "./Domain";

import { WHEEL } from "./seed";

class Menu extends Domain {
  public async getWheelPrizes() {
    return new Promise<API.Wheel>((resolve) => {
      setTimeout(() => {
        resolve(WHEEL);
      }, 1000);
    });
  }
}

export default Menu;
