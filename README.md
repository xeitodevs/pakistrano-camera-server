# Pakistrano camera server

This software allows you to easily control Foscam
camera family via http requests through a fast and secure api gateway.

## Camera driver
This is Node js express server that wraps the camera driver. This driver
its available [here](github.com/xeitodevs/pakistrano-camera-control.git).
So if you only want to control the camera from nodejs without the http interface, this is what you want.

## Run the server with docker
This is the preferred aproach to run the server. First thing is to create a volume
to store data. Then you can run the server. Here is an example with all options:
```bash

# Create the data volume
docker volume create cameras_data

# Run the server
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=production" \ ## optional. this is the default
-e "AUTH_TOKEN=<here your secret token>" \
-e "USE_TLS=1" ## optional. this is the default. (not available yet)
xeitodevs/pakistrano-camera-server:latest
```
Have fun !!!

## Exposing the API
Api has two main purpose methods
* The camera CRUD
* The camera control command endpoint, with the following available commands
   * startMoveRight
   * startMoveLeft
   * centerCamera
   * stopAxes
   * startMoveUp
   * startMoveDown
   * startMoveBottomRight
   * startMoveBottomLeft
   * startMoveUpRight
   * startMoveUpLeft
   * startHorizontalPatrol
   * stopHorizontalPatrol
   * startVerticalPatrol
   * stopVerticalPatrol
   * activateIrView
   * deactivateIrView

### Authentication

When not in development, this server uses bearer token authentication,
so don`t forget to set your compliant authorization with [RFC6750](https://tools.ietf.org/html/rfc6750)

### Camera registration
``` bash
curl --request POST \
  --url http://localhost:3000/cameras \
  --header 'content-type: application/json' \
  --data '{
	"name": "labcamera",
    "host": "10.0.8.4",
    "user": "admin",
    "password": "admin"
}'

```

### Camera listing
``` bash
curl --request GET \
  --url http://localhost:3000/cameras \
  --header 'content-type: application/json'
```

### Getting camera
``` bash
curl --request GET \
  --url http://localhost:3000/cameras/labcamera \
  --header 'content-type: application/json'
```

### Camera ping
``` bash
curl --request GET \
  --url http://localhost:3000/cameras/labcamera/ping \
  --header 'content-type: application/json'
```
### Get camera snapshot
``` bash
curl --request GET \
  --url http://localhost:3000/cameras/labcamera/snapshot \
  --header 'content-type: application/json'
```
### Get camera video stream
``` bash
curl --request GET \
  --url http://localhost:3000/cameras/labcamera/video-stream \
  --header 'content-type: application/json'
```
### Send one command to an specific camera (see the command list above)
``` bash
curl --request POST \
  --url http://localhost:3000/cameras/labcamera/control \
  --header 'content-type: application/json' \
  --data '{
	"command": "startMoveRight"
}'
```
### Update one camera.
```bash
curl --request PUT \
  --url http://localhost:3000/cameras/labcamera \
  --header 'content-type: application/json' \
  --data '{
	"name": "labcamera",
  "host": "10.0.8.2",
  "user": "adminnnn",
  "password": "adminnnn"
}'
```
### Delete one camera
``` bash
curl --request DELETE \
  --url http://localhost:3000/cameras/labcamera \
  --header 'content-type: application/json'
```
### Delete all cameras
``` bash
curl --request DELETE \
  --url http://localhost:3000/cameras \
  --header 'content-type: application/json'
```

## How to run tests
- Run ALL tests
    ```bash
    npm test
    ```
- Run tests in watch mode
    ```bash
    npm run-script test:watch
    ```
- Run only unit tests
    ```
    npm run-script test:unit
    ```