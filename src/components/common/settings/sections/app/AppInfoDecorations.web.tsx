const ReleaseIcon = () => {
  return <img src="./public/icon_release.svg" height={250} width={250} />;
};

const DebugIcon = () => {
  return <img src="./public/icon_debug.svg" height={250} width={250} />;
};

export const isDebug = __DEV__;

export const AppIcon = isDebug ? DebugIcon : ReleaseIcon;

const versionGradient = `linear-gradient(90deg, ${isDebug ? '#d3bc5f80' : '#0ad3c1a0'}, ${isDebug ? '#a4801f80' : '#f30f77a0'})`;

export const GradientStyle = {'background-image': versionGradient};
