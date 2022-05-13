import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";

import { Wheel } from "@components";
import { client } from "@app/config";
import { Suspense } from "react";

const gameAtom = atom(async () => client.Game.getWheelPrizes());

const PANNEL_WIDTH = 150;
const PANNEL_HEIGHT = 120;

function predicate(prize: API.WheelPrize | null) {
  return (item: API.WheelPrize) =>
    prize === null ? item.isLost : item.prizeId === prize.prizeId;
}

const onFinished = () => {
  // eslint-disable-next-line no-alert
  alert("Finished!");
};

function WheelGame() {
  const [{ prize, wheelPrizes }] = useAtom(gameAtom);

  return (
    <Wheel
      height={PANNEL_HEIGHT}
      width={PANNEL_WIDTH}
      data={wheelPrizes}
      predicate={predicate(prize)}
      onFinished={onFinished}
    >
      {(pannel) => (
        <PrizeImage
          src={pannel.item.wheelIllustrationUrl}
          draggable={false}
          loading="lazy"
        />
      )}
    </Wheel>
  );
}

const PrizeImage = styled("img")`
  width: ${PANNEL_WIDTH}px;
  height: ${PANNEL_HEIGHT}px;
`;

function Games() {
  return (
    <Root>
      <Suspense fallback="loading...">
        <WheelGame />
      </Suspense>
    </Root>
  );
}

const Root = styled("div")``;

export default Games;
