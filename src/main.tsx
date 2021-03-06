import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { css, Global } from "@emotion/react";
import { QueryClientProvider, QueryClient } from "react-query";

import Pages from "@pages";

const queryClient = new QueryClient();

function Root() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Pages />
        <Global styles={styles} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const styles = css`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;900&display=swap");

  body {
    margin: 0;
    width: 100%;
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
    font-size: 14px;
  }

  #action {
    font-size: 14px;
  }
`;

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Root />);
