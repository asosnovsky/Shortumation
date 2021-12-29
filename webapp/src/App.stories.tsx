import App from "./App";
import { withQuery } from "@storybook/addon-queryparams";

const book = {
  title: "App/App",
  decorators: [withQuery],
  component: App
};

export const Basic = () => <App />

export default book;
