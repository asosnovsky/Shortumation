import React, { FC } from "react";
import { ErrorBoundary } from ".";

import { makeStory } from "devUtils";
import { MockPage } from "components/Page";
import { ComponentStory } from "@storybook/react";

const { make, componentMeta } = makeStory({
  Component: () => <div>Example</div>,
  meta: {
    title: "ErrorBoundary",
    component: ErrorBoundary,
  },
});

export default componentMeta;
export const Example = make({});

export const ErrorThrown: ComponentStory<typeof ErrorBoundary> = (args) => {
  const BadComponent: FC = () => {
    throw new Error("!!!");
  };
  return (
    <MockPage>
      <ErrorBoundary>
        <BadComponent />
      </ErrorBoundary>
    </MockPage>
  );
};

export const NoError: ComponentStory<typeof ErrorBoundary> = (args) => {
  const GoodComponent: FC = () => {
    return <span>All Good.</span>;
  };
  return (
    <MockPage>
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    </MockPage>
  );
};
