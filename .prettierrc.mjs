/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      printWidth: 120,
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
