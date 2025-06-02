module.exports = [
  {
    plugins: {
      "unused-imports": require("eslint-plugin-unused-imports"),
      tailwindcss: require("eslint-plugin-tailwindcss"),
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "tailwindcss/no-custom-classname": "off",
    },
  },
];