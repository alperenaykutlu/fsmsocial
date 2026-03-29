import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      JWT_SECRET: 'test-secret-key',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    },
  },
});