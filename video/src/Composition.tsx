import { Composition } from "remotion";
import { InkToFolio } from "../../src/intro/InkToFolio";
export const MyComposition = () => (
  <>
    <Composition
      id="InkToFolio"
      component={InkToFolio}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={216}
      defaultProps={{ mobile: false }}
    />
    <Composition
      id="InkToFolioMobile"
      component={InkToFolio}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={216}
      defaultProps={{ mobile: true }}
    />
  </>
);
