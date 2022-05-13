import { Suspense } from "react";
import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";

import { Wheel, Scratch } from "@components";
import { client } from "@app/config";

const wheelGameAtom = atom(async () => client.Game.getWheelPrizes());

const PANNEL_WIDTH = 150;
const PANNEL_HEIGHT = 120;

function predicate(prize: API.WheelPrize | null) {
  return (item: API.WheelPrize) =>
    prize === null ? item.isLost : item.prizeId === prize.prizeId;
}

const onWheelFinished = () => {
  // eslint-disable-next-line no-alert
  alert("Finished!");
};

function WheelGame() {
  const [{ prize, wheelPrizes }] = useAtom(wheelGameAtom);

  return (
    <Wheel
      height={PANNEL_HEIGHT}
      width={PANNEL_WIDTH}
      data={wheelPrizes}
      predicate={predicate(prize)}
      onFinished={onWheelFinished}
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

const scratchGameAtom = atom(async () => client.Game.getScratchIllustrations());

const onScratchFinished = () => {
  // eslint-disable-next-line no-alert
  alert("Finished!");
};

const SCRATCH_CARD_HEIGHT = 400;
const SCRATCH_CARD_WIDTH = 300;

function ScratchGame() {
  const [{ scratchCardCoverUrl, scratchCardWonUrl }] = useAtom(scratchGameAtom);

  return (
    <Scratch
      onFinished={onScratchFinished}
      coverUrl={scratchCardCoverUrl}
      hiddenUrl={scratchCardWonUrl}
      width={SCRATCH_CARD_WIDTH}
      height={SCRATCH_CARD_HEIGHT}
    />
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

      <Suspense fallback="loading...">
        <ScratchGame />
      </Suspense>
    </Root>
  );
}

const Root = styled("div")``;

export default Games;
