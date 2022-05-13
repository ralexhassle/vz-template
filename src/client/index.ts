import Session from "./Session";
import { Menu, Game } from "./domains";

export interface ClientConfig {
  server: string | undefined;
}

export interface Client {
  Session: Session;
  Menu: Menu;
  Game: Game;
}

const createClient = (config: ClientConfig): Client => {
  const { server } = config;

  if (!server) {
    throw Error("No server provided ! Please check your .env file");
  }

  const session = new Session({ server });

  return {
    Session: session,
    Menu: new Menu({ session }),
    Game: new Game({ session }),
  };
};

export default createClient;
