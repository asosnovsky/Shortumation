# Changelog ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=for-the-badge)

## [0.1.20] - UI Bugfixes

- Using MUI elements for input time
- Added delay action / wait_on_triggers action
- Added enabled/disabled flag in node editor
- Optional flip vertical during desktop mode
- Fixed up modal clipping

## [0.1.19] - Vertical mobile mode

- in mobile mode we draw the graphs vertically now

## [0.1.17] - Websockets

- Connected to HA main websocket -- now we retrieve real-time information about
    
    * Device names
    * Entity names/ids

- Autocomplete for devices and entities

## [0.1.14] - Material UI + Autocomplete

- Brought some Material UI elements for input and text
- Autocomplete for tags
- Using 'id' as alias for trigger (as it seems to break HA otherwise)
- Not using 'alias' for conditions, always auto-generating it (again, this used to break HA)
- Added missing `data` object to service-actions

## [0.1.13] - YAML

- Better YAML
- Rewrote yaml parser/loader to use pyyaml and safe mode
- Cleaned up description vs alias

## [0.1.12] - Less Intense Error Messages

- Added more node-based errors (this way it's easier to see where validations failed)
- Made the validators less strict in order to capture more edge cases that HA supports
- Nicer auto-generated descriptions for some trigger nodes


## [0.1.10] - More Bug Fixes

- Allowing null or undefined values for metadata fields
- Trigger.platform==time will now have the .at property better supported

## [0.1.9] - Fixed up invalid types for various triggers

- Some triggers had invalid types and were causing a false-positive validation

## [0.1.8] - Support for Malformed Automations

- API will no longer error out on missing values or invalid lists
- Frontend has support for displaying bad automations

## [0.1.6] - Mobile Mode

- Improved mobile mode
- Fixed up arrow styles due to typos
- Added selection color

## [0.1.2] - Docker Hub Images

- Publishing images to docker hub is now stable

## [0.0.15] - Publish to dockerhub

- Publishing images to docker hub

## [0.0.14] - Using vanila ha yaml

- Supporing vanilla out of the box HA yaml as oppose to parsing them (no more $smType)
- Conditions have now a more a explicit node

## [0.0.13] - Better Styling with react-flow

- Fixed up styling (using react-flow)
- cleaned up some button styles

## [0.0.12] - Tags

- Added tag management system for automations

## [0.0.11] - Zoom

- Added lazy saving

## [0.0.10] - Zoom

- Introducing Zoom!

## [0.0.9] - First Working Version

- Instalable verion via github
- Initial POC done 


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
