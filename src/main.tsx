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
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap");

  body {
    margin: 0;
    font-family: "Montserrat", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    --font-regular: 400;
    --font-medium: 500;
    --font-semiBold: 600;
    --font-bold: 700;
    --font-black: 900;
  }

  #root {
    isolation: isolate;
    position: relative;
    height: 100%;
  }

  #dialog {
    font-size: calc(10px + 2vmin);
  }

  #action {
    font-size: calc(10px + 2vmin);
  }
`;

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Root />);
