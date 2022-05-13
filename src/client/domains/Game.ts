/* eslint-disable class-methods-use-this */
import Domain from "./Domain";

import { WHEEL, SCRATCH } from "./seed";

class Menu extends Domain {
  public async getWheelPrizes() {
    return new Promise<API.Wheel>((resolve) => {
      setTimeout(() => {
        resolve(WHEEL);
      }, 1000);
    });
  }

  public async getScratchIllustrations() {
    return new Promise<API.Scratch>((resolve) => {
      setTimeout(() => {
        resolve(SCRATCH);
      }, 1000);
    });
  }
}

export default Menu;
