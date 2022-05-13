import Session from "./Session";
import { ClientConfig, Client } from "./types";

const createClient = (config: ClientConfig): Client => {
  const { server } = config;

  if (!server) {
    throw Error("No server provided ! Please check your .env file");
  }

  const session = new Session({ server });

  return {
    Session: session,
  };
};

export default createClient;
