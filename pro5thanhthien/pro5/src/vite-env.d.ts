/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPLINE_SCENE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
