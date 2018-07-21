[![Build Status](https://travis-ci.org/xeitodevs/pakistrano-camera-server.svg?branch=master)](https://travis-ci.org/xeitodevs/pakistrano-camera-server)

# Pakistrano camera server

This software allows you to easily control Foscam
camera family via http requests through a fast and secure api gateway.

## Camera driver (before you continue reading)
This is nodejs express server that wraps the camera driver. This driver
is available [here](https://www.github.com/xeitodevs/pakistrano-camera-control.git).
So, if you only want to control the camera from nodejs without the http interface, this is what you want.

## Run the server with docker

This is the preferred approach to run the server. You will need to create a volume
to store data. Then you can run the server. Here is an example with all options:

#### I want  to run my server in development mode (no authentication).
```bash
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=development" \
test:latest
```
#### I want to run my server on production, without SSL
```bash
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=production" \
-e "AUTH_TOKEN=<here your secret token>" \
test:latest
```
#### I want to run my server on production, with auto self-signed generated certificate by the server.
```bash
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=production" \
-e "AUTH_TOKEN=<here your secret token>" \
-e "ENABLE_SSL=1" \
test:latest
```
#### I want to run my server on production, with auto self-signed generated certificate by the server, tunning the certificate attributes.
```bash
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=production" \
-e "AUTH_TOKEN=<here your secret token>" \
-e "ENABLE_SSL=1" \
-e "SSL_CERTIFICATE_SUBJECT_STRING=/C=US/ST=Denial/L=Springfield/O=MyOrganization/CN=www.mycam.com" \
test:latest
```
#### I want to run my server on production, with my own specified certificate.
```bash
docker run --rm \
-v cameras_data:/home/node/app/var \
-d \
-p 3000:3000 \
-e "NODE_ENV=production" \
-e "AUTH_TOKEN=<here your secret token>" \
-e "ENABLE_SSL=1" \
-e "SSL_B64_CERT=$(base64 -w 0 /path/to/your/server.cert)" \
-e "SSL_B64_KEY=$(base64 -w 0 /path/to/your/server.key)" \
test:latest
```
#### Docker boot behaviour
The next environment variables are only intended for the first-time generation of
camera database and certificates. They will become unnecessary after first boot since
all that data is now available in the generated data volume.
- SSL_CERTIFICATE_SUBJECT_STRING
- SSL_B64_CERT
- SSL_B64_KEY
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
    "user": "admin2",
    "password": "admin2"
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