# Changelog ![GitHub release (latest by date)](https://img.shields.io/github/v/release/asosnovsky/Shortumation?label=&style=for-the-badge)

## [0.7.3] Bugfixes

- Backend now correctly returns unset alias + description

## [0.7.1] Bugfixes + Italian!

- Added support for automations that do not have an `id`
- Added Italian
- Merged grammar fixes for french
- Fixed up strange centering styling bug
- Replaced more non-multilingual texts with multilingual text

## [0.7.0] Configuration Menu / Light Mode / Lang Support

- Added configuration menu
  ![image](https://user-images.githubusercontent.com/7451445/187817636-311b5a83-4e08-4b6b-b3b8-2e7086ace136.png)
- Experimental light mode
  ![image](https://user-images.githubusercontent.com/7451445/187817711-c7a8e23c-b9a4-472b-a348-c1492f3c5d56.png)
- First attempt at a french translation
- No longer using sqllite for automation db

## [0.6.3] - Packages Support & Minor UI improvements

- Full split config support for packages and all advance include directives (i.e. !include_dir_named, !include_dir_merge_list etc)
- Updated metadata box to display origin of the file
- Support for inlined automations!

![image](https://user-images.githubusercontent.com/7451445/187043147-15cea23b-0b64-4484-9c87-747998ea9fe6.png)

## [0.6.1] - v0.6.0 Split Config Support & Better Error handling!

- Added visual support for split config (this was a heavy refactor!)

<img width="400px" src="https://user-images.githubusercontent.com/7451445/185440594-f988c136-dd35-4a44-99d9-6d54d2a27882.png" />

- Capturing invalid files before they happen
  <img width="400px" src="https://user-images.githubusercontent.com/7451445/185440785-ad48f4b3-b6c5-4362-9222-426c07c95776.png"/>

- Trying to provide better information on common pitfals
  ![image](https://user-images.githubusercontent.com/7451445/185440955-c7f15f95-c9cf-4368-bc4a-b84140b97b00.png)

- Better global error capture
  ![image](https://user-images.githubusercontent.com/7451445/185441268-9dbde36e-b28b-4a13-bd7f-45ae23834e78.png)

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

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
