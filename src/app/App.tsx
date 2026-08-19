import { SovereignExperience } from "./experiences";
import { AtlasStateProvider } from "./state";
import AtlasSeo from "./seo/AtlasSeo";

export default function App() {
  return (
    <AtlasStateProvider>
      <AtlasSeo />
      <SovereignExperience />
    </AtlasStateProvider>
  );
}
