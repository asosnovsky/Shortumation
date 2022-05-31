# Shortumation ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=platsic)

[![Test](https://github.com/asosnovsky/Shortumation/actions/workflows/test.yml/badge.svg)](https://github.com/asosnovsky/Shortumation/actions/workflows/test.yml)
 ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/asosnovsky/Shortumation/Manual%20Build) 
|  | Stable | amd64-edge | i386-edge | armv7-edge | aarch64-edge | armhf-edge |
| --- | --- | --- | --- | --- | --- | --- |
| Version | ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-amd64?&sort=date&label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-i386?&sort=date&label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-armv7?&sort=date&label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-aarch64?&sort=date&label=&style=for-the-badge) | ![Docker Image Version (latest semver)](https://img.shields.io/docker/v/asosnovsky/shortumation-armhf?&sort=date&label=&style=for-the-badge) |

A better way to write automations in home-assistant without having to install and run a seperate automation engine!

![image](https://user-images.githubusercontent.com/7451445/170770378-122c6722-993d-40ac-801d-387cfaccd41f.png)

![image](https://user-images.githubusercontent.com/7451445/170770572-fd38950a-b6b4-4b49-8c94-fb0a5f3008ce.png)


A [home-assistant addon](https://www.home-assistant.io/addons/) for a better UI for managing your automations & scripts. We provide a way to visualize and develop your automation using a visual-programming language that draws inspirations from [Node-Red](https://nodered.org/).

## Features

- [X] View your automations & scripts in a visual graph
- [X] See all automations in one common view
- [X] Automation Manager
- [X] Tags for automation organization
- [ ] Script Manager
- [ ] Use secrets and global parameters
- [ ] Autocomplete fields for entities/devices
- [ ] Autocomplete fields for template editor 
- [ ] Autocomplete fields for referencing scripts 

See roadmap in [Version 1 Github Project](https://github.com/asosnovsky/Shortumation/projects/1).

## Installation

### Addon

Add the repository URL under **Supervisor → Add-on store → ⋮ → Manage add-on repositories**:

    https://github.com/asosnovsky/Shortumation

It should now appear in your `Add-on Store` and you should be able to install it!

### Containerized

Please note that this way of using Shortumation is **not future proof**, currently we use the `/config/automation.yaml` file as our source of truth for the automations. Which means that we do not need access to the HA API or Websockets. In future release you may need to configure some additional compomenents to enable this. 

If this warning does not scare you or you still want to try things out, then take a look at the example [docker-compose.yaml](example/containerized/docker-compose.yaml).


## FAQ

**How is this different from Node-Red?**

  > Node-Red is both an execution engine and an automation editor, which means that in order for you automations to run you have to have an additional component running and executing the automations. Shortumation simply provides a different editor and manager for writing Homeassistant automations, while relying on Homeassistant to execute the automations (this uses the `automations.yaml` file as the backend database)

**Which HA Installation does this support?**

  > Currently this is only tested on HA OS. However, you should be able to get it working supervised installations as well (as they support addons). If you want to make it work for Container or Core, you will need to do some additional leg-work and I welcome a PR to get this working (it should be just a matter of mounting the `/config` path to the container running the images in this repo).

**Which version of HA does this require?**

  > Since I am working on this project on my own, I can only test it against my own HA installations at home, and I tend to keep things as up to date as possible. The lowest version of HA this was tested on is `core-2022.5.4`
