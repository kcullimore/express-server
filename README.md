# Express Server for layoutEngine Backend

## Overview 

This is a simple Express server for use with the [layoutEngine](https://github.com/pmur002/layoutengine) R package. It is primary server for the [layoutEngineExpress](https://github.com/kcullimore/layoutengineexpress) backend.  

## Docker 

This server is intended to be run from within a docker container. 


Download the [docker image](https://hub.docker.com/repository/docker/kcull/layoutengine-express):  
``` 
$ docker pull kcull/layoutengine-express:latest
```


Run the container:   

```
$ docker run --rm -it \
         --network host \
         --privileged=true \
         --name layoutengine-express \
         kcull/layoutengine-express:latest
```
