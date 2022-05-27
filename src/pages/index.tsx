import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import styled from "@emotion/styled";

import Menu from "./Menu";
import Games from "./Games";
import Playground from "./Playground";

function Introduction() {
  return <code>React + Vite + Typescript + ESLint + Jotai + Router</code>;
}

function App() {
  return (
    <Container>
      <h1>Vazee Template</h1>
      <Navigation>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/playground">Playground</NavLink>
      </Navigation>
      <Outlet />
    </Container>
  );
}

const Navigation = styled("nav")`
  display: flex;

  margin-bottom: 1em;

  a {
    color: rgb(96, 96, 96);
    margin-right: 1em;

    text-decoration: underline;
  }

  .active {
    color: #ffc600;
  }
`;

const Container = styled("main")`
  display: flex;
  flex-direction: column;

  min-height: 100vh;
  padding: 0.5em;

  font-size: calc(10px + 2vmin);
  color: rgb(96, 96, 96);

  background-color: rgb(240, 240, 240);

  > code {
    text-align: center;
  }
`;

function Pages() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<Introduction />} />
        <Route path="menu" element={<Menu />} />
        <Route path="games" element={<Games />} />
        <Route path="playground" element={<Playground />} />
      </Route>
    </Routes>
  );
}

export default Pages;
