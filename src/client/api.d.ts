import * as Constants from "./constants";

// eslint-disable-next-line @typescript-eslint/ban-types
type Body = {};

interface ErrorDetail {
  field: string;
  message: string;
}

interface Error {
  name: string;
  message: string;
  details?: ErrorDetail[];
}

type NoContent = null;

interface Category {
  categoryId: number;
  parentId: number | null;
  description: string;
  order: number;
  enabled: boolean;
}

interface Product {
  productId: number;
  categoryId: number;
  label: string;
  description: string | null;
  enabled: boolean;
  order: number;
  price1: number;
  price2: number | null;
  price3: number | null;
  price4: number | null;
  price5: number | null;
  price1Label: string | null;
  price2Label: string | null;
  price3Label: string | null;
  price4Label: string | null;
  price5Label: string | null;
  pictogramUrl: string | null;
}

interface PostProduct {
  categoryId: number;
  label: string;
  description: string | null;
  enabled: boolean;
  order: number;
  price1: number;
  price2: number | null;
  price3: number | null;
  price4: number | null;
  price5: number | null;
  price1Label: string | null;
  price2Label: string | null;
  price3Label: string | null;
  price4Label: string | null;
  price5Label: string | null;
  pictogramUrl: string | null;
}

interface PostCategory {
  parentId: number | null;
  description: string;
  order: number;
  enabled: boolean;
}

interface Menu {
  menuId: number;
  products: Product[];
  categories: Category[];
}

interface WheelPrize {
  prizeId: number;
  label: string;
  illustrationUrl: string | null;
  wheelIllustrationUrl: string;
  isLost: boolean;
}

interface Prize {
  prizeId: number;
  label: string;
  illustrationUrl: string | null;
  wheelIllustrationUrl: string;
  isLost: boolean;
}

interface Wheel {
  prize: Prize | null;
  wheelPrizes: WheelPrize[];
}

interface Scratch {
  scratchCardCoverUrl: string;
  scratchCardLostUrl: string;
  scratchCardWonUrl: string;
}

export as namespace API;
