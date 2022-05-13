import { Route, Routes } from "react-router-dom";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";

import { Spinner } from "@app/components";

function App() {
  return (
    <Container>
      <h1>Vazee Template</h1>
      <Spinner isLoading />
      <Global styles={styles} />
    </Container>
  );
}

const styles = css`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    isolation: isolate;
    position: relative;
    height: 100%;
  }
`;

const Container = styled("main")`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function Pages() {
  return (
    <Routes>
      <Route index element={<App />} />
    </Routes>
  );
}

export default Pages;
