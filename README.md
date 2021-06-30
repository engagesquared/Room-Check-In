## About this project

Location Check In is a custom Teams app that tracks employee's use meeting rooms in case of a COVID case, and increases the efficiency of room use.

## Project setup

All required source code are located in the `./src` folder:

* `client` client side code
* `server` server side code
* `public` static files for the web site
* `manifest` for the Microsoft Teams app manifest

For further details see the [Yo Teams documentation](https://github.com/PnP/generator-teams/docs)

## Azure Resources
1. Review variables in **main.tf** file in **azureResources** folder and make sure all values are set properly
2. Install the Azure CLI and Terraform CLI:
   - Linux (WSL) or OSX, using Brew
    ```bash
    brew update && brew install azure-cli && brew install hashicorp/tap/terraform
    ```
   - Windows
      - [Install or Update Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-powershell)
      - [Install Terraform](https://www.terraform.io/downloads.html)
3. In terminal: cd to **azureResources** folder & run below command to login to Azure of target environment (dev/test/uat/prod)
    ```bash
    az login --tenant <tenant-id>
    ```
4. In terminal: cd to **azureResources** folder &  run below command to review all changes:
    ```bash
    terraform init
    ```
5. In terminal: cd to **azureResources** folder &  run below command to apply all changes:
    ```bash
    terraform plan
    ```
6. In terminal: cd to **azureResources** folder & run below command to apply all changes:
    ```bash
    terraform apply -auto-approve
    ```

## Key Vault
1. Navigate to key vault
2. Go to Certificates
3. Download .CER file of certificate *tab-room-check-in-certificate*
   
## Registered Application
1. create new regitered application
2. set Authentication
3. set expose an API
4. set API permissions
5. upload .CER certificate file downloaded from key-vault

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

Configuration is stored in the `.env` & `.development.env` file.

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
