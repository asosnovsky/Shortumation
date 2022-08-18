# Changelog ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=for-the-badge)

## [0.6.1] - v0.6.0 Split Config Support & Better Error handling!

- Added visual support for split config (this was a heavy refactor!)

<img width="400px" src="https://user-images.githubusercontent.com/7451445/185440594-f988c136-dd35-4a44-99d9-6d54d2a27882.png" />

- Capturing invalid files before they happen
  <img width="400px" src="https://user-images.githubusercontent.com/7451445/185440785-ad48f4b3-b6c5-4362-9222-426c07c95776.png"/>

- Trying to provide better information on common pitfals
  ![image](https://user-images.githubusercontent.com/7451445/185440955-c7f15f95-c9cf-4368-bc4a-b84140b97b00.png)

- Better global error capture
  ![image](https://user-images.githubusercontent.com/7451445/185441268-9dbde36e-b28b-4a13-bd7f-45ae23834e78.png)

## [0.5.3] - Bug Fixes

- Redirecting `/` to `/web` to resolve container install strangeness reported in https://github.com/asosnovsky/Shortumation/issues/125
- Fixed missing flag that caused the automation to explode in https://github.com/asosnovsky/Shortumation/issues/124

## [0.5.2] - Better Controls

- Add automation trigger
- Speed dial on the bottom
  <img src="https://user-images.githubusercontent.com/7451445/183231968-9891bbb4-5c7c-4e05-b804-36978c809a5c.png" width="200px"/>
- Infinite undos <img src="https://user-images.githubusercontent.com/7451445/183231977-ed000017-2886-4a57-b5fb-c7e527bf3894.png" width="200px"/>

## [0.5.1] - Sidebar!

- completely redesigned the sidebar!

  - Disable/enable automatons
  - See 'bad state' automatons
  - Delete automatons from registry (in cases where references are stale)
  - Refactored sidebar UX to match MUI standards
  - Cleaned up editing tags in sidebar
    <img src="https://user-images.githubusercontent.com/7451445/182066721-07a93651-2f83-44d5-8420-15093caa52df.png" width="400px"/>

- Websockets now live-refresh when updates occur

## [0.4.0] - Depedency update

- Core dependency updates
- Python port is now dynamically set

## [0.3.4] - Condition/Trigger Editor Upgrades!

- Many condition editor fixes
- Many trigger editor fixes
- Refactor time triggers & condition triggers (time + time pattern are now in a single node selection --- trying to keep list selection small)
- Support for condition: time weekdays
- Support for time inputs (using both timestamp device classes and input_datetime)
- Fixed up condition editor nesting error (though still a better experience on pc, it is mostly usable on mobile)
- Description generation for time+time pattern condition and triggers

![image](https://user-images.githubusercontent.com/7451445/180237072-e5bd37bf-b89f-4978-a0ca-1cc71d9bd5a8.png)

![image](https://user-images.githubusercontent.com/7451445/180237749-519244ad-ef94-4a3f-8925-67ac3ed98ee8.png)

![image](https://user-images.githubusercontent.com/7451445/180238004-4b04f13a-77a2-4c4c-9144-963dbc394bf4.png)

## [0.3.2] - Fixed Addon Image for arm-based devices

- Using hypercon instead of uvicorn (this losses the rust dependency which makes it easier to install on arm)
- Pre-building web assets outside of docker (this takes the image size down and speeds up instaltion of addon)
- Updated build scripts to actually fail installation when build/prep steps fail
- Ensured that builds for all architecture run successfully
- Re-worked github actions (quicker test phases)

## [0.3.1] - Increased Pagination + Restricted Repeat Node

- Increased pagination to display up to 10,000 autos for now
- Repeat node now has types

## [0.3.0] - Complete Refactor of Graphs

- Added visual support for

  - Repeat Nodes
  - Parallel Nodes

- Using collections for conditions & triggers
- Fixed several bugs with improper alerts
- Fixed graph breakage during zoom
- Support for enable/disable nodes in UI

![image](https://user-images.githubusercontent.com/7451445/179135734-8d7ca46d-7e6f-4975-abc3-de86a48de0c0.png)

![image](https://user-images.githubusercontent.com/7451445/179135790-a5e77e2b-6d42-4810-a27b-ff4d165e99ec.png)

![image](https://user-images.githubusercontent.com/7451445/179135916-8083aab5-bee1-4d27-b19d-9e000ca012f9.png)

## [0.1.22] - Many Visual improvements

- Deprecated several custom components in favor of mui.com
- Device Editor now has support for 99% of diplay types
- Condition Device is implemented
- Improved naming autogen for trigger & choose

## [0.1.21] - Service Editor

- first version of service editor
- reloading automations on save

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

  - Device names
  - Entity names/ids

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
