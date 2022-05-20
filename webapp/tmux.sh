#!/bin/bash
TMUX_SESSION=shortu-webapp

tmux kill-ses -t $TMUX_SESSION
tmux new -s $TMUX_SESSION -d
tmux send-keys -t $TMUX_SESSION 'yarn tsc' C-m
tmux splitw -h -p 66 -t $TMUX_SESSION
tmux send-keys -t $TMUX_SESSION 'yarn test' C-m
tmux splitw -h -t $TMUX_SESSION
tmux send-keys -t $TMUX_SESSION 'yarn storybook' C-m
tmux a -t $TMUX_SESSION