import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Bioestimuladores, DURATION_SECONDS } from "./Bioestimuladores";
import { FPS, HEIGHT, WIDTH } from "./Bioestimuladores/theme";
import { DURATION_SECONDS as TRAYECTORIA_SECONDS, Trayectoria } from "./Trayectoria";
import { DURATION_SECONDS as MEDIDA_SECONDS, MedidaJusta } from "./MedidaJusta";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MedidaJusta"
        component={MedidaJusta}
        durationInFrames={Math.round(MEDIDA_SECONDS * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Trayectoria"
        component={Trayectoria}
        durationInFrames={Math.round(TRAYECTORIA_SECONDS * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Bioestimuladores"
        component={Bioestimuladores}
        durationInFrames={Math.round(DURATION_SECONDS * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
