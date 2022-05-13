import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import Pages from "@pages";

function Root() {
  return (
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<Root />);
