# room checkin app - Microsoft Teams App

Generate a Microsoft Teams application.

TODO: Add your documentation here

## Getting started with Microsoft Teams Apps development

Head on over to [Microsoft Teams official documentation](https://developer.microsoft.com/en-us/microsoft-teams) to learn how to build Microsoft Teams Tabs or the [Microsoft Teams Yeoman generator docs](https://github.com/PnP/generator-teams/docs) for details on how this solution is set up.

## Project setup

### Azure Resources (App Registration)
Browse to Azure Active Directory in the Microsoft 365 admin center or Azure portal.

b. Under "Manage", click "App Registration" to open the App Registrations. Then click "+ New registration" to register a new application.
c. Give your application a name and select who can use the application. The sample was tested using the first option, "Accounts in this organizational directory only" but the multitenant option should work as long as you use the multitenant endpoint ??????
d. Under Redirect URI, enter http://localhost:3000/ for local debugging.
e. Under API permissions, click "+ Add a permission", then click Microsoft Graph, and then click Delegated permissions. Grant "User.Read","Place.Read.All", "Calendars.Read", "Calendars.ReadWrite" permissions.
f. Return to the application overview and make note of your Application (client) ID and Directory (tenant) ID; you'll need them in the next step.

### Azure Resources (Web App)
1. Make sure the resource group is available in Azure is set correctly
3. Install the Azure CLI and Terraform CLI:
   - Windows Subsystem for Linux (WSL) or OSX, using Brew, in terminal:
   ```bash
   brew update && brew install azure-cli
   ```
   - Windows
      - [Install or Update Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-powershell)
4. In terminal: run below command to login to Azure of target environment (dev/test/uat/prod)
   ```bash
   az login --tenant <tenant-id>

   //E2 DEV - tenant-id: 9e917a0a-b367-451c-995e-826b731b78c6
   ```
5. In terminal: run below command to create web app app of target environment (dev/test/uat/prod)
TODO


### Teams App
All required source code are located in the `./src` folder:

* `client` client side code
* `server` server side code
* `public` static files for the web site
* `manifest` for the Microsoft Teams app manifest

For further details see the [Yo Teams documentation](https://github.com/PnP/generator-teams/docs)

## Building the app

The application is built using the `build` Gulp task.

``` bash
npm i -g gulp-cli
gulp build
```

## Building the manifest

To create the Microsoft Teams Apps manifest, run the `manifest` Gulp task. This will generate and validate the package and finally create the package (a zip file) in the `package` folder. The manifest will be validated against the schema and dynamically populated with values from the `.env` file.

``` bash
gulp manifest
```

## Deploying the manifest

Using the `yoteams-deploy` plugin, automatically added to the project, deployment of the manifest to the Teams App store can be done manually using `gulp tenant:deploy` or by passing the `--publish` flag to any of the `serve` tasks.


## Configuration

Configuration is stored in the `.env` file.

## Debug and test locally

To debug and test the solution locally you use the `serve` Gulp task. This will first build the app and then start a local web server on port 3007, where you can test your Tabs, Bots or other extensions. Also this command will rebuild the App if you change any file in the `/src` directory.

``` bash
gulp serve
```

To debug the code you can append the argument `debug` to the `serve` command as follows. This allows you to step through your code using your preferred code editor.

``` bash
gulp serve --debug
```

## Useful links
 * [Debugging with Visual Studio Code](https://github.com/pnp/generator-teams/blob/master/docs/docs/vscode.md)
 * [Developing with ngrok](https://github.com/pnp/generator-teams/blob/master/docs/docs/ngrok.md)
 * [Developing with Github Codespaces](https://github.com/pnp/generator-teams/blob/master/docs/docs/codespaces.md)


## Additional build options

You can use the following flags for the `serve`, `ngrok-serve` and build commands:

* `--no-linting` or `-l` - skips the linting of Typescript during build to improve build times
* `--debug` - builds in debug mode
* `--env <filename>.env` - use an alternate set of environment files
* `--publish` - automatically publish the application to the Teams App store

## Deployment

The solution can be deployed to Azure using any deployment method.

* For Azure Devops see [How to deploy a Yo Teams generated project to Azure through Azure DevOps](https://www.wictorwilen.se/blog/deploying-yo-teams-and-node-apps/)
* For Docker containers, see the included `Dockerfile`

## Logging

To enable logging for the solution you need to add `msteams` to the `DEBUG` environment variable. See the [debug package](https://www.npmjs.com/package/debug) for more information. By default this setting is turned on in the `.env` file.

Example for Windows command line:

``` bash
SET DEBUG=msteams
```

If you are using Microsoft Azure to host your Microsoft Teams app, then you can add `DEBUG` as an Application Setting with the value of `msteams`.
