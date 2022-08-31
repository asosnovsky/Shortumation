import { ComponentStory } from "@storybook/react";

import { Page } from "components/Page";
import { SpeedDial } from ".";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { DeleteForeverOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: SpeedDial,
  BaseTemplate: () => (
    <div
      style={{
        maxWidth: "10em",
        maxHeight: "10em",
      }}
    >
      <SpeedDial icon={<SettingsApplicationsIcon />}>
        <ButtonIcon icon={<DeleteForeverOutlined />} />
        <ButtonIcon icon={<EditIcon />} />
      </SpeedDial>
    </div>
  ),
  meta: {
    title: "Nav/SpeedDial",
  },
});

export default componentMeta;
export const IconList = make({});
