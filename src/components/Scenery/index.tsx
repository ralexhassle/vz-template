import { Children, ReactNode, useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { useAtomValue } from "jotai";
import styled from "@emotion/styled";

import { countAtom, indexAtom, sceneStyleAtom } from "./atoms";

const WIDTH = 100;

function SceneryContainer({ children }: { children: ReactNode }) {
  const style = useAtomValue(sceneStyleAtom);
  return <Main style={style}>{children}</Main>;
}

interface Props {
  children: ReactNode;
  Viewport: React.ComponentType<{ children: ReactNode }>;
}
function Scenery({ children, Viewport }: Props) {
  const setCount = useUpdateAtom(countAtom);
  const currentIndex = useAtomValue(indexAtom);

  useEffect(() => {
    setCount(Children.count(children));
  }, [children, setCount]);

  return (
    <Viewport>
      <SceneryContainer>
        {Children.map(children, (child: React.ReactNode, index: number) => (
          <section
            data-scene={index === currentIndex}
            style={{ transform: `translateX(${index * WIDTH}%)` }}
          >
            {index === currentIndex && child}
          </section>
        ))}
      </SceneryContainer>
    </Viewport>
  );
}

const Main = styled("main")`
  position: relative;

  width: 100%;
  height: 100%;

  will-change: transform;
  transition: transform 400ms cubic-bezier(0.3, 0.7, 0.4, 1);

  > section {
    position: absolute;
    left: 0px;

    height: 100%;
    width: 100%;
  }
`;

export default Scenery;
