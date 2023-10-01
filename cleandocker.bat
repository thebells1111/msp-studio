@echo off
setlocal enabledelayedexpansion

:: List all dangling image IDs and store them in a temporary file
docker images -f "dangling=true" --format "{{.ID}}" > temp_images.txt

:: Loop through each image ID
for /f %%i in (temp_images.txt) do (
  :: Find and stop containers using the current image ID
  for /f %%c in ('docker ps -a --filter "ancestor=%%i" --format "{{.ID}}"') do (
    docker stop %%c
    docker rm %%c
  )
)

:: Remove the temporary file
del temp_images.txt

:: Remove all dangling images
docker image prune -f

:: End of script
