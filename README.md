# Forecast Demo App
This is an example application for demonstrating some of the features of the **Amazon Forecast** service.
Despite this main purpose, **AWS Amplify** is also used to achieve an easy authorization method with the help of **Amazon Cognito**.

The application is composed by two different modules:
1. [backend](./backend): basically is a NodeJS Express server that deploys a couple of methods to be consumed by the frontend module.
**IMPORTANT NOTE:** it uses **AWS CLI** because **Amazon Forecast** is in public preview and the AWS specific language libraries (AWS SDK) are not yet updated for it.
2. [frontend](./frontend): this module is based on **React** to build the final webpage. It also uses **AWS Amplify** to have a simple integration with **Amazon Cognito** and force users to be registered before accesing the forecast results.
