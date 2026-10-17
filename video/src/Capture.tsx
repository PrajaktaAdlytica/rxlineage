// Local-only capture harness. The Vite production entry remains index.html.
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { InkToFolio } from "../../src/intro/InkToFolio";
const mobile =
  new URLSearchParams(location.search).has("mobile") ||
  innerHeight > innerWidth;
createRoot(document.getElementById("root")!).render(
  <Player
    component={InkToFolio}
    inputProps={{ mobile }}
    durationInFrames={180}
    initialFrame={90}
    compositionWidth={mobile ? 1080 : 1920}
    compositionHeight={Math.round(
      ((mobile ? 1080 : 1920) * innerHeight) / innerWidth,
    )}
    fps={30}
    controls={false}
    clickToPlay={false}
    initiallyMuted
    numberOfSharedAudioTags={0}
    style={{ width: "100%", height: "100%" }}
  />,
);
