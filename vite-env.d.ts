/// <refrence types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_BE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}