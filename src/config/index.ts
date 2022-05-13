import createClient from "@app/client";

const config = {
  env: import.meta.env.MODE,
  server: import.meta.env.VITE_API_URL,
};

export const client = createClient({ server: config.server });

export default config;
