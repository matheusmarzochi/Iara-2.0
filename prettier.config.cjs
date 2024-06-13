/** @type {import("prettier").Config} */

const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  printWidth: 80,
  quoteProps: "as-needed",
};

module.exports = config;
