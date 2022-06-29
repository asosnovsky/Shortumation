import { ComponentStory } from "@storybook/react";

import { Page } from "components/Page";
import { SpeedDial } from ".";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { DeleteForeverOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

export default {
  title: "Nav/SpeedDial",
  component: SpeedDial,
};

export const IconList: ComponentStory<typeof SpeedDial> = () => {
  return (
    <Page>
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
    </Page>
  );
};
