# Shortumation 

A better way to write automations in home-assistant without having to install and run a seperate automation engine!

![image](https://user-images.githubusercontent.com/7451445/168672575-fb19997d-fe9b-4192-96b0-733b62519797.png)

![image](https://user-images.githubusercontent.com/7451445/168672840-71ceaa8a-2bee-443e-9150-5b0f03b05d08.png)


A [home-assistent addon](https://www.home-assistant.io/addons/) for a better UI for managing your automations & scripts. We provide a way to visualize and develop your automation using a visual-programming language that draws inspirations from [Node-Red](https://nodered.org/).

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


## FAQ

**How is this different from Node-Red?**

  > Node-Red is both an execution engine and an automation editor, which means that in order for you automations to run you have to have an additional component running and executing the automations. Shortumations simply provides a different editor and manager for writing Homeassistant automations, while relying on Homeassistant to execute the automations (this uses the `automations.yaml` file as the backend database)

**Which HA Installation does this support?**

  > Currently this is only tested on HA OS. However, you should be able to get it working supervised installations as well (as they support addons). If you want to make it work for Container or Core, you will need to do some additional leg-work and I welcome a PR to get this working (it should be just a matter of mounting the `/config` path to the container running the images in this repo).

**Which version of HA does this require?**

  > Since I am working on this project on my own, I can only test it against my own HA installations at home, and I tend to keep things as up to date as possible. The lowest version of HA this was tested on is `core-2022.5.4`
