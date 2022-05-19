import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { css, Global } from "@emotion/react";

import Pages from "@pages";

function Root() {
  return (
    <BrowserRouter>
      <Pages />
      <Global styles={styles} />
    </BrowserRouter>
  );
}

const styles = css`
  body {
    margin: 0;
    font-family: -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    isolation: isolate;
    position: relative;
    height: 100%;
  }

  #dialog {
    font-size: calc(10px + 2vmin);
  }
`;

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Root />);
