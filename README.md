# SleepEar

## Build

### Install

Clone this repo:

    git clone git@github.com:WilliamNHarvey/breathingUI.git

Run `npm install` to install the dependencies:

    npm install

Install Gulp globally:

    npm install gulp -g

### Running the app

Build the frontend files running:

    gulp

For development, use `gulp watch` to build the frontend files automatically.

Configure your MongoDB database and credentials on `app.js`:

    mongoose.connect('mongodb://<user>:<pass>@<host>:<port>/<db>');

_NOTE: If you don't have a MongoDB on your development machine, a simple way to start with this app is create a free MongoDB instance at [Mongolab](https://mongolab.com/home)._

Runs like a typical express app:

    node app.js

_For development enviroment, I recommend [Supervisor](https://github.com/isaacs/node-supervisor)._

### Running tests

I have to learn more about tests. So, it's on my roadmap for this seed.

## Directory Layout

    app.js              --> App config
    package.json        --> For npm
    bower.json          --> Frontend libs dependencies
    frontend/           --> All of the source files to be used in on the client side (will be compiled on public/)
      sass/             --> Stylesheet files
        app.sass        --> Default sass stylesheet
        includes/       --> Divide our stylesheet in parts
      img/              --> Image files
      js/               --> Javascript files
        app.js          --> Declare top-level app module
        main.js         --> Default config for RequireJS
        sleepear/       --> SleepEar module
          controllers/  --> All controllers of our module
          services/     --> All services of our module
          sleepear.js   --> Declare module and routes config
        directives/     --> Define our application directives
      lib/              --> Our bower dependencies are installed here
    public/             --> Our genereted files will be placed here (after run gulp)
    routes/
      api.js            --> Top-level route config
      index.js          --> Route for serving HTML pages and partials (AngularJS templates)
      api/              --> All route configs of our modules will be here
        sleepear.js     --> Route config.
    views/
      index.jade        --> Main page for app, where the top-level ui-view is defined
      layout.jade       --> Doctype, title, head boilerplate
      partials/         --> Angular view partials (partial jade templates)
        index.html      --> The default state (for UI Router)
        sleepear/       --> All the templates for our module are listed here

