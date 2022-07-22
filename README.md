# Shortumation ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=platsic)

[![Test](https://github.com/asosnovsky/Shortumation/actions/workflows/test.yml/badge.svg)](https://github.com/asosnovsky/Shortumation/actions/workflows/test.yml) [![Build](https://github.com/asosnovsky/Shortumation/actions/workflows/build.yml/badge.svg)](https://github.com/asosnovsky/Shortumation/actions/workflows/build.yml)

|         | Stable                                                                                                                         | Edge                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Version | ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-amd64?&sort=date&label=&style=for-the-badge) |

A [home-assistant addon](https://www.home-assistant.io/addons/) for a better UI for managing and writing your automations. We provide a way to visualize  your automation using a visual-programming language that draws inspirations from [Node-Red](https://nodered.org/).

## Features

- Sort and organize your home-assistant automations using tags!

    <img src="https://user-images.githubusercontent.com/7451445/179136346-cf04a8c0-ac4e-44b2-b9fe-806824864660.png" width="500px"/>

- Utilize the auto-generated node descriptions to understand what your automation is doing! No more reading YAML to just understand what 1 node does!

    <img src="https://user-images.githubusercontent.com/7451445/179137357-455260f3-2cdd-44ca-ae62-084ed7c59ebd.png" width="500px"/>

- More condense UI for service calls!

    <img src="https://user-images.githubusercontent.com/7451445/179137126-93601ea9-435f-4c4f-8f21-0d09cd61c7a2.png" width="500px"/>

- Visualize complex 'choose' or 'if/else' nodes

    <img src="https://user-images.githubusercontent.com/7451445/179135734-8d7ca46d-7e6f-4975-abc3-de86a48de0c0.png" width="500px"/>

- Visualize parallel nodes!

    <img src="https://user-images.githubusercontent.com/7451445/179136706-695912d7-e223-42d9-a27b-f330b021a56a.png" width="500px"/>

- Visualize repeat nodes!

    <img src="https://user-images.githubusercontent.com/7451445/179135790-a5e77e2b-6d42-4810-a27b-ff4d165e99ec.png" width="500px"/>

See roadmap in [Version 1 Github Project](https://github.com/asosnovsky/Shortumation/projects/1).

## Installation

### Addon

Add the repository URL under **Supervisor → Add-on store → ⋮ → Manage add-on repositories**:

    https://github.com/asosnovsky/Shortumation

It should now appear in your `Add-on Store` and you should be able to install it!

### Containerized or HA Core

Please note that this way of using Shortumation is **not future proof**.

If this warning does not scare you or you still want to try things out, then take a look at the example [docker-compose.yaml](example/containerized/docker-compose.yaml), or read the [extended guide here](https://github.com/asosnovsky/Shortumation/wiki/Installation#containerized--ha-core).

## FAQ

**How is this different from Node-Red?**

> Node-Red is both an execution engine and an automation editor, which means that in order for your automations to run you have to have an additional component running and executing the automations. Shortumation simply provides a different editor and manager for writing Homeassistant automations, while relying on Homeassistant to execute the automations (this uses the `automations.yaml` file as the backend database)

**Which HA Installation does this support?**

> Currently this is only tested on HA OS. However, you should be able to get it working supervised installations as well (as they support addons). If you want to make it work for Container or Core, you will need to do some additional leg-work and I welcome a PR to get this working (it should be just a matter of mounting the `/config` path to the container running the images in this repo).

**Which version of HA does this require?**

> Since I am working on this project on my own, I can only test it against my own HA installations at home, and I tend to keep things as up to date as possible. The lowest version of HA this was tested on is `core-2022.5.4`

**This is awesome and all, how can I help?**

> Take a look at our Roadmap in [Version 1 Github Project](https://github.com/asosnovsky/Shortumation/projects/1), the [Development Guide](https://github.com/asosnovsky/Shortumation/wiki/Development) and send me some PRs to review!

> Please also note that I did went ahead and marked some [good first issues](https://github.com/asosnovsky/Shortumation/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) if you want to pick them up just leave a comment and I will give you more context (I haven't had time to add more details).
