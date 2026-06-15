import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: { react, "react-hooks": hooks },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: { react: { version: "detect" } }
  }
];
