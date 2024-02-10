#Installation
### Create source folder (/vaw/www as example !!!!!!!!)
```bash
$ mkdir /var/www
$ cd /var/www
```

### Make install
```bash
$ sudo apt-get install build-essential -y
```

### Edit .env file
```dotenv
BACKEND_URL=http://{SERVER_IP}:{BACKEND_PORT}/
#AS EXAMPLE: BACKEND_URL=http://127.0.0.1:8081/
```

### Dependencies
```bash
$ make install
```

### Ports
```bash
$ make ports
```

### Env
```bash
$ make env
```

### Build
```bash
$ make build
```