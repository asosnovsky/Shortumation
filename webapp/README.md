# Development Guide

## Prerequisites

- https://code.visualstudio.com/
- https://nodejs.org/en/
- https://www.docker.com/

## Setup

Open this folder directly with vscode. As soon as it happens you will be prompted to install certain extensions and you should see a few tasks automatically spin up. Primarily:

- `npm: tsc`: scans code and validate the syntax is correct
- `npm: test`: automatically run test cases
- `npm: start`: automatically starts the webap on port `3000`
- `npm: storybook`: automatically starts storybook on port `6006` (I recommend you develop containers using this first!)
- `Docker: Server`: this will start the Shortumation server as well as a development Homeassistant container (you can access these over locahost:8123 and localhost:8000).

If you don't need some of these, you can turn them off by selecting the 'trash can' icon to their right.
