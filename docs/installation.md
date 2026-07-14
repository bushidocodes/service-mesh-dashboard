### Using Docker

#### 1. Install Docker

Download and install the binary for [Mac](https://store.docker.com/editions/community/docker-ce-desktop-mac), [Windows](https://store.docker.com/editions/community/docker-ce-desktop-windows), or [Linux](https://store.docker.com/search?architecture=amd64&offering=community&operating_system=linux&platform=server&q=&type=edition)

#### 2. Use docker to start an example Grey Matter Microservice

##### For a JVM-based microservice:

Run `docker run -it -p 1337:9990 spmcbride1201/gm-fab-jvm`

After starting your microservice, you should see a valid JSON file [at this endpoint](http://localhost:1337/admin/metrics.json). If you see JSON data, you are ready to proceed.

##### For a Go-based microservice:

Run `docker run -it -p 1337:10001 drfogout/metricssimple`

After starting your microservice, you should see a valid JSON file [at this endpoint](http://localhost:1337/metrics). If you see JSON data, you are ready to proceed.#

## Configuration

If JVM microservice (gm-fabric-jvm) :
Edit `./public/index.html` by replacing `__RUNTIME__` with `JVM`

If GO microservice (gm-fabric-go):
Edit `./public/index.html` by replacing `__RUNTIME__` with `GO`

If Service Discovery Service (SDS) microservice (mock-sds):
Edit `./public/index.html` by commenting out `<meta property="fabricServer" content="__FABRIC_SERVER__">` and uncommenting `<meta property="fabricServer" content="http://localhost:1337">`

## Use

### General Users trying the Dashboard

1. Ensure a microservice is running on your system serving metrics.json from [http://localhost:9990/admin/metrics.json](http://localhost:9990/admin/metrics.json)
2. From the project directory `./gm-fabric-dashboard`, run `npm start` and [http://localhost:3000](http://localhost:3000) will open automatically in your browser
3. Report bugs or desired enhancements on [the project's issues page](https://github.com/DecipherNow/gm-fabric-dashboard/issues)
4. When finished, stop the local server serving your dashboard (and perhaps the local server serving your microservice) by pressing `control+c` on the respective terminals running these servers

### Developers building, testing, and integrating the Dashboard

#### `npm start` to develop features and crush bugs

This runs the app in the development mode and automatically opens [http://localhost:3000](http://localhost:3000) in your browser. You can open the source code in your editor of choice, and the page will reload if you make edits.

We suggest use of the [Biome](https://biomejs.dev/guides/editors/first-party-extensions/) editor extension and [EditorConfig](http://editorconfig.org/#download) to apply the project's style and lint rules.

Additionally, if you are a VS Code user, this project supports in-editor debugging via the [Debugger for Chrome extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and has a custom dictionary for the [Code Spellchecker extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

#### `npm test` to enhance front-end unit test coverage

This launches the Jest test runner in interactive watch mode.<br>
See the Create React App section about [running tests](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests) for more information.

Note: If you are running on Mac OS, tests might fail with the error `Error: Error watching file for changes: EMFILE`. If you see this, install watchman via brew with the command `brew install watchman`. Read more about this workaround [on this Jest issue](https://github.com/facebook/jest/issues/1767)

#### `npm run build` to prepare the Dashboard for deployment to the core `gm-fabric-jvm` project

This builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

Once built, the production bundle is minified and ready for deployment. The dashboard assumes that it is monitoring a microservice at the root path with Twitter Server metrics accessible at `/admin/metrics.json` and `/admin/threads`. The dashboard itself is served from `/gmadmin/`.

In order to support deployment of the dashboard to monitor a microservice that doesn't own the root path, this projects injects the string template `__BASE_URL__` in the minified index.html file and JS bundle that can be replaced to set the desired path. For your convenience, a BASH script is provided to simplify this deployment process and provide an undo option.

For example, if you are going to deploy the dashboard to a microservice located at `http://www.deciphernow.com/my/awesome/microservice/`, your dashboard will be located at the path `/my/awesome/microservice/gmadmin/` and poll endpoints at `/my/awesome/microservice/admin/metrics.json` and `/my/awesome/microservice/admin/threads`. To configure the dashboard for this path,`cd` into the ./build directory and execute `sudo ./setPath.sh /my/awesome/microservice/gmadmin/`. Please note that the path should have both an opening and a trailing slash. Additionally, the path must terminate in `/gmadmin/` to allow the dashboard to properly determine the URLs of the scrape targets. If you do not have `/gmadmin/` at the end of the string you pass into `setPath.sh`, the deployment script will fail and exit. After running this script successfully, your application is ready to be deployed.

In case of error or mis-configuration, your original `index.html` has been backed up to `index.html.old`. To revert to the backup, run `sudo ./setPath.sh undo` and rerun with the correct argument.

In addition to `__BASE_URL__`, the HEAD of index.html also has an meta attribute with a `__BASE_RUNTIME__` template string. This signifies to the dashboard whether the dashboard intends to scrape a Finagle-style `metrics.json` or an alternate Decipher-designed metrics endpoint provided by a Go microservice. The permissable values are `JVM`, `GO`, or `ENVOY`. Currently, the `setPath.sh` script does not modify this template.
