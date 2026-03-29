import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        env: {
            JWT_SECRET: "sdkgalgaldgnl2214jhnn",       // ← tamamen uydurma, ne yazsan olur
            JWT_REFRESH_SECRET: "ksdlgjaljgaghlasgb21312s"// ← aynı şek
        },
    },
});