# Backend Forecast Demo
This module of the demo application publishes a simple API REST with a couple of methods to interact with the **AWS CLI**.
Regarding this purpose, an **Express server** will be launched but before starting it, it is necessary to fill three params for the configuration:
```
var options = new Options(
	/* accessKey    */ '<Fill this placeholder with an access key>',
	/* secretKey    */ '<Fill this placeholder with a secret key>',
	/* sessionToken */ '<Fill this placeholder with a session token>',
	/* currentWorkingDirectory*/  null
);
```
After doing the previous step you can install the necessary dependencies and start the server:
```
npm install
npm start
```
