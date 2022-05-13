import { Fragment, Suspense, useReducer } from "react";
import styled from "@emotion/styled";
import { atom, useAtom } from "jotai";

import { Wheel, Scratch, Dialog } from "@components";
import { client } from "@app/config";

const wheelGameAtom = atom(async () => client.Game.getWheelPrizes());

const PANNEL_WIDTH = 150;
const PANNEL_HEIGHT = 120;

function predicate(prize: API.WheelPrize | null) {
  return (item: API.WheelPrize) =>
    prize === null ? item.isLost : item.prizeId === prize.prizeId;
}

function WheelGame() {
  const [{ prize, wheelPrizes }] = useAtom(wheelGameAtom);
  const [isFinished, toggle] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <Wheel
        height={PANNEL_HEIGHT}
        width={PANNEL_WIDTH}
        data={wheelPrizes}
        predicate={predicate(prize)}
        onFinished={toggle}
      >
        {(pannel) => (
          <PrizeImage
            src={pannel.item.wheelIllustrationUrl}
            draggable={false}
            loading="lazy"
          />
        )}
      </Wheel>
      {isFinished && <Dialog message="Finished !" dismiss={toggle} />}
    </Fragment>
  );
}

const scratchGameAtom = atom(async () => client.Game.getScratchIllustrations());

const SCRATCH_CARD_HEIGHT = 400;
const SCRATCH_CARD_WIDTH = 300;

function ScratchGame() {
  const [{ scratchCardCoverUrl, scratchCardWonUrl }] = useAtom(scratchGameAtom);
  const [isFinished, toggle] = useReducer((s) => !s, false);

  return (
    <Fragment>
      <Scratch
        onFinished={toggle}
        coverUrl={scratchCardCoverUrl}
        hiddenUrl={scratchCardWonUrl}
        width={SCRATCH_CARD_WIDTH}
        height={SCRATCH_CARD_HEIGHT}
      />
      {isFinished && <Dialog message="Finished !" dismiss={toggle} />}
    </Fragment>
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
        <ScratchGame />
      </Suspense>
    </Root>
  );
}

const Root = styled("div")``;

export default Games;
