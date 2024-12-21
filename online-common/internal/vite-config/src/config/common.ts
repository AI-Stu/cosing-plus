import type { UserConfig } from 'vite';

async function getCommonConfig(): Promise<UserConfig> {
  return {
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      sourcemap: false
    }
  };
}

export { getCommonConfig };
