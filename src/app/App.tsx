import { Analytics } from '@vercel/analytics/react';
import { SovereignExperience } from "./experiences";
import { AtlasStateProvider } from "./state";

export default function App() {
  return (
    <AtlasStateProvider>
      <SovereignExperience />
      <Analytics />
    </AtlasStateProvider>
  );
}
