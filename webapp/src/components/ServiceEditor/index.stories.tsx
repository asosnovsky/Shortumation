import React, { FC, useEffect, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { ServiceEditor } from ".";
import { TypedHassService } from "haService/fieldTypes";
import InputYaml from "components/Inputs/Base/InputYaml";

export default {
  title: "Services/ServiceEditor",
  component: ServiceEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof ServiceEditor>;

const Template: ComponentStory<typeof ServiceEditor> = (props) => {
  const [state, setState] = useState(props.data);
  return (
    <Page>
      <div
        style={{
          maxHeight: "99vh",
          overflow: "auto",
        }}
      >
        <ServiceEditor
          {...props}
          data={state}
          onUpdate={(d) => {
            setState(d);
            props.onUpdate(d);
          }}
        />
        <div
          style={{
            maxHeight: "25vh",
            overflow: "auto",
          }}
        >
          <InputYaml label="" value={state} onChange={() => {}} />
        </div>
        <div
          style={{
            maxHeight: "25vh",
            overflow: "auto",
          }}
        >
          <InputYaml
            label=""
            value={props.service.fields}
            onChange={() => {}}
          />
        </div>
        <div
          style={{
            maxHeight: "25vh",
            overflow: "auto",
          }}
        >
          <InputYaml
            label=""
            value={props.service.target ?? {}}
            onChange={() => {}}
          />
        </div>
      </div>
    </Page>
  );
};

const makeExample = (service: TypedHassService) => {
  const Eg = Template.bind({});
  Eg.args = {
    ...Eg,
    service,
    data: {
      target: {},
      field: {},
    },
  };
  return Eg;
};

export const NumberSetValue = makeExample({
  name: "Set",
  description: "Set the value of a Number entity.",
  fields: {
    value: {
      name: "Value",
      description: "The target value the entity should be set to.",
      example: 42,
      selector: { text: null },
    },
  },
  target: { entity: { domain: "number" } },
});

export const LightTurnOn = makeExample({
  name: "Turn on",
  description:
    "Turn on one or more lights and adjust properties of the light, even when they are turned on already.\n",
  target: {
    entity: {
      domain: "light",
    },
  },
  fields: {
    transition: {
      name: "Transition",
      description: "Duration it takes to get to next state.",
      selector: {
        number: {
          min: 0,
          max: 300,
          unit_of_measurement: "seconds",
        },
      },
    },
    rgb_color: {
      name: "Color",
      description: "The color for the light (based on RGB - red, green, blue).",
      selector: {
        color_rgb: null,
      },
    },
    rgbw_color: {
      name: "RGBW-color",
      description:
        "A list containing four integers between 0 and 255 representing the RGBW (red, green, blue, white) color for the light.",
      advanced: true,
      example: "[255, 100, 100, 50]",
      selector: {
        object: null,
      },
    },
    rgbww_color: {
      name: "RGBWW-color",
      description:
        "A list containing five integers between 0 and 255 representing the RGBWW (red, green, blue, cold white, warm white) color for the light.",
      advanced: true,
      example: "[255, 100, 100, 50, 70]",
      selector: {
        object: null,
      },
    },
    color_name: {
      name: "Color name",
      description: "A human readable color name.",
      advanced: true,
      selector: {
        select: {
          options: [
            "homeassistant",
            "aliceblue",
            "antiquewhite",
            "aqua",
            "aquamarine",
            "azure",
            "beige",
            "bisque",
            "blanchedalmond",
            "blue",
            "blueviolet",
            "brown",
            "burlywood",
            "cadetblue",
            "chartreuse",
            "chocolate",
            "coral",
            "cornflowerblue",
            "cornsilk",
            "crimson",
            "cyan",
            "darkblue",
            "darkcyan",
            "darkgoldenrod",
            "darkgray",
            "darkgreen",
            "darkgrey",
            "darkkhaki",
            "darkmagenta",
            "darkolivegreen",
            "darkorange",
            "darkorchid",
            "darkred",
            "darksalmon",
            "darkseagreen",
            "darkslateblue",
            "darkslategray",
            "darkslategrey",
            "darkturquoise",
            "darkviolet",
            "deeppink",
            "deepskyblue",
            "dimgray",
            "dimgrey",
            "dodgerblue",
            "firebrick",
            "floralwhite",
            "forestgreen",
            "fuchsia",
            "gainsboro",
            "ghostwhite",
            "gold",
            "goldenrod",
            "gray",
            "green",
            "greenyellow",
            "grey",
            "honeydew",
            "hotpink",
            "indianred",
            "indigo",
            "ivory",
            "khaki",
            "lavender",
            "lavenderblush",
            "lawngreen",
            "lemonchiffon",
            "lightblue",
            "lightcoral",
            "lightcyan",
            "lightgoldenrodyellow",
            "lightgray",
            "lightgreen",
            "lightgrey",
            "lightpink",
            "lightsalmon",
            "lightseagreen",
            "lightskyblue",
            "lightslategray",
            "lightslategrey",
            "lightsteelblue",
            "lightyellow",
            "lime",
            "limegreen",
            "linen",
            "magenta",
            "maroon",
            "mediumaquamarine",
            "mediumblue",
            "mediumorchid",
            "mediumpurple",
            "mediumseagreen",
            "mediumslateblue",
            "mediumspringgreen",
            "mediumturquoise",
            "mediumvioletred",
            "midnightblue",
            "mintcream",
            "mistyrose",
            "moccasin",
            "navajowhite",
            "navy",
            "navyblue",
            "oldlace",
            "olive",
            "olivedrab",
            "orange",
            "orangered",
            "orchid",
            "palegoldenrod",
            "palegreen",
            "paleturquoise",
            "palevioletred",
            "papayawhip",
            "peachpuff",
            "peru",
            "pink",
            "plum",
            "powderblue",
            "purple",
            "red",
            "rosybrown",
            "royalblue",
            "saddlebrown",
            "salmon",
            "sandybrown",
            "seagreen",
            "seashell",
            "sienna",
            "silver",
            "skyblue",
            "slateblue",
            "slategray",
            "slategrey",
            "snow",
            "springgreen",
            "steelblue",
            "tan",
            "teal",
            "thistle",
            "tomato",
            "turquoise",
            "violet",
            "wheat",
            "white",
            "whitesmoke",
            "yellow",
            "yellowgreen",
          ],
        },
      },
    },
    hs_color: {
      name: "Hue/Sat color",
      description:
        "Color for the light in hue/sat format. Hue is 0-360 and Sat is 0-100.",
      advanced: true,
      example: "[300, 70]",
      selector: {
        object: null,
      },
    },
    xy_color: {
      name: "XY-color",
      description: "Color for the light in XY-format.",
      advanced: true,
      example: "[0.52, 0.43]",
      selector: {
        object: null,
      },
    },
    color_temp: {
      name: "Color temperature",
      description: "Color temperature for the light in mireds.",
      selector: {
        color_temp: {
          min_mireds: 153,
          max_mireds: 500,
        },
      },
    },
    kelvin: {
      name: "Color temperature (Kelvin)",
      description: "Color temperature for the light in Kelvin.",
      advanced: true,
      selector: {
        number: {
          min: 2000,
          max: 6500,
          step: 100,
          unit_of_measurement: "K",
        },
      },
    },
    brightness: {
      name: "Brightness value",
      description:
        "Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness and 255 is the maximum brightness supported by the light.",
      advanced: true,
      selector: {
        number: {
          min: 0,
          max: 255,
        },
      },
    },
    brightness_pct: {
      name: "Brightness",
      description:
        "Number indicating percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness and 100 is the maximum brightness supported by the light.",
      selector: {
        number: {
          min: 0,
          max: 100,
          unit_of_measurement: "%",
        },
      },
    },
    brightness_step: {
      name: "Brightness step value",
      description: "Change brightness by an amount.",
      advanced: true,
      selector: {
        number: {
          min: -225,
          max: 255,
        },
      },
    },
    brightness_step_pct: {
      name: "Brightness step",
      description: "Change brightness by a percentage.",
      selector: {
        number: {
          min: -100,
          max: 100,
          unit_of_measurement: "%",
        },
      },
    },
    white: {
      name: "White",
      description:
        "Set the light to white mode and change its brightness, where 0 turns the light off, 1 is the minimum brightness and 255 is the maximum brightness supported by the light.",
      advanced: true,
      selector: {
        number: {
          min: 0,
          max: 255,
        },
      },
    },
    profile: {
      name: "Profile",
      description: "Name of a light profile to use.",
      advanced: true,
      example: "relax",
      selector: {
        text: null,
      },
    },
    flash: {
      name: "Flash",
      description: "If the light should flash.",
      advanced: true,
      selector: {
        select: {
          options: [
            {
              label: "Long",
              value: "long",
            },
            {
              label: "Short",
              value: "short",
            },
          ],
        },
      },
    },
    effect: {
      name: "Effect",
      description: "Light effect.",
      selector: {
        text: null,
      },
    },
  },
});

export const ZhaLight = makeExample({
  name: "Turn Light",
  description: "",
  fields: {
    entity: {
      description: "Light Entity",
      selector: {
        entity: {
          domain: "light",
          integration: "zha",
        },
      },
    },
  },
});

export const UltimateService = makeExample({
  name: "Ultimate Service",
  description: "Show a notification in the frontend.",
  fields: {
    message: {
      name: "Text",
      description: "Message body of the notification. [Templates accepted]",
      example: "Please check your configuration.yaml.",
      selector: {
        text: null,
      },
    },
    entity_id: {
      name: "Entity with domain filter",
      description: "Name(s) of media player entities.",
      selector: {
        entity: {
          domain: "media_player",
        },
      },
    },
    level: {
      name: "Options",
      description: "Log level.",
      default: "error",
      selector: {
        select: {
          options: [
            {
              label: "Debug",
              value: "debug",
            },
            {
              label: "Info",
              value: "info",
            },
            {
              label: "Warning",
              value: "warning",
            },
            {
              label: "Error",
              value: "error",
            },
            {
              label: "Critical",
              value: "critical",
            },
          ],
        },
      },
    },
    format: {
      name: "String Options",
      description: "Stream format supported by media player.",
      default: "hls",
      selector: {
        select: {
          options: ["hls"],
        },
      },
    },
    keep_days: {
      name: "Number",
      description: "Number of history days to keep in database after purge.",
      selector: {
        number: {
          min: 0,
          max: 365,
          unit_of_measurement: "days",
        },
      },
    },
    repack: {
      name: "Boolean",
      description:
        "Attempt to save disk space by rewriting the entire database file.",
      default: false,
      selector: {
        boolean: null,
      },
    },
    domains: {
      name: "Objects",
      description:
        "List the domains that need to be removed from the recorder database.",
      example: "sun",
      default: [],
      selector: {
        object: null,
      },
    },
    addon: {
      name: "Add-on",
      description: "The add-on slug.",
      example: "core_ssh",
      selector: {
        addon: null,
      },
    },
    name: {
      name: "Theme",
      description: "Name of a predefined theme",
      example: "default",
      selector: {
        theme: null,
      },
    },
    icon: {
      name: "Icon",
      description: "Name of icon for the group.",
      example: "mdi:camera",
      selector: {
        icon: null,
      },
    },
  },
});
