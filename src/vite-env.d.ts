/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MENU_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
