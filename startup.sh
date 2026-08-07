# make sure the podman or the docker is present 
set-e
echo "Starting the app "
#!/bin/bash

CONTAINER_CMD=podman

$CONTAINER_CMD compose -f ./compose-dev.yml up -d

npm run start:dev