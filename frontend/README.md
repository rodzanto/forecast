# Frontend Forecast Demo
This module of the demo application is a simple webpage that interacts with the backend module doing some REST calls using AJAX and showing the results in a graph.
Additionally, it uses **AWS Amplify** and **Amazon Cognito** to only let authorized users view the forecast.

## Setup
To complete the setup process there are a few steps to complete:

1. Install all the specified **dependencies** in the file 'package.json'
```
npm install
```

2. Initialize **AWS Amplify**. In the screenshot you can see the choosen values but you should set your own ones)
```
amplify init
```
![Screenshot Amplify Init command](../images/AmplifyInit.png)

3. Add the required feature for **Amazon Cognito**
```
amplify auth add
```
![Screenshot Amplify Auth Add command](../images/AmplifyAuthAdd.png)

4. Build all the local backend (in this case, only Auth feature) and **provision it in AWS**
```
amplify push
```
![Screenshot Amplify Push command](../images/AmplifyPush.png)

5. Finally, you can start the webpack server that automatically will open the url: http://localhost:8080
```
npm run start
```
![Screenshot Login](../images/Login.png)

