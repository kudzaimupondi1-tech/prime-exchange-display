@echo off
echo Starting Prime Exchange Display in Kiosk Mode using Chrome...
start chrome --kiosk --autoplay-policy=no-user-gesture-required "http://localhost:5173"
exit
