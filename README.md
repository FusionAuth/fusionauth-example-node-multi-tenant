# FusionAuth Node.js example

This project is two simple example Node.js applications that illustrates how you can easily implement multi tenant applications using FusionAuth.

## To run

This assumes you already have a running FusionAuth instance, user and application running locally. If you don't, please see the [5-Minute Setup Guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide) to do so.

* Create two local aliases in your DNS: `hooli.local` and `piedpiper.local`, both resolving to `127.0.0.1`.
* Log into the FusionAuth admin panel
* Create two tenants, `Hooli Tenant` and `Pied Piper Tenant`
* Create two applications, `Hooli` and `Pied Piper`
  * Update the `Hooli` FusionAuth application to allow a redirect of `http://hooli.local:3001/oauth-redirect`
  * Update the `Pied Piper` FusionAuth application to allow a redirect of `http://piedpiper.local:3000/oauth-redirect`
* Create a user in each tenant. They can have different passwords.
* Make sure your user has a first name. 
* Register your user for the applications in the corresponding tenant. 
* Return to your terminal window.
* In the `hooli` directory, run:
  * `npm install`
  * update `routes/index.js` with the client id and client secret of your FusionAuth application.
  * `PORT=3001 npm start`
* In the `piedpiper` directory, run:
  * `npm install`
  * update `routes/index.js` with the client id and client secret of your FusionAuth application.
  * `PORT=3000 npm start`

Open an incognito browser (or a different one) 

Go to `http://hooli.local:3001/` and login with the previously created user for the Hooli application.

You should see 'Hello [firstname]'.

Then go to `http://piedpiper.local:3000`. You will be prompted to sign in again with the different password.

