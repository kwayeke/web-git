// Web-git is a wrapper for Dexie.js --> indexedDB to implement
// a JavaScript-based REST API that stores data client side.

/* OPTIONAL PARAMETERS
[1] url: the url to parse to interact with the database. If not provided, the page url will be used (default)
[2] specfile: the specification json file for allowable commands. If not provided, js/spec.json is used (default)
*/

// 
// 1. come up with a formal spec for params to talk to dexie functions
// 2. create html/web view to use CRUD hooks to update user on status of that
// 3. figure out version control
// 4. add interactive elements to upload data in different ways, export data, plot data, etc.
// 5. add interactive elements to view databases, select / change active database, delete database
// 6. how can we add version control? can we integrate github?

function webGit(url,specfile) {

    // webGit init should take the url... if not defined, used document.URL
    this.url = url || document.URL;
    this.specfile = specfile || "spec.json";

    // Timestamp setter, seconds
    this.now = function() {
        return Math.floor(Date.now() / 1000)
    }


    // COMMAND SPEC FUNCTIONS ////////////////////////////////////

    // Load the spec (commands) into the object
    this.load_spec = function(url) {

        // STOPPED HERE - running into issue need to access "this" inside of promise,
        // but can't...

        // https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
        var url = url || this.specfile
        var holder = this;
        this.load_url(url).then(function(spec){
            console.log("COMMAND SPEC LOADED:")
            // the variable holder references our web-git object in memory
            holder.spec = spec;
            console.log(spec);

            // Set each of the defaults
            var database = {};
            for (var key in holder.spec) {
                if (holder.spec.hasOwnProperty(key)) {
                    if (holder.spec[key].hasOwnProperty('default')) {
                        database[key] = holder.spec[key]['default'];
                   }
                }
            }
            console.log("DATABASE PARAMS LOADED:")
            holder.database = database;
            console.log(database);
        });
        
    }

    // FILE OPERATIONS ///////////////////////////////////////////

    // Serial Xhr request, if web worker not available
    function get_json(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);  // synchronous request
        xhr.send(null);
        return JSON.parse(xhr.responseText);
    }

    // load an external json (url)
    this.load_url = function (url) {

        return new Promise((resolve, reject) => {
            if (typeof(Worker) !== "undefined") {
                const worker = new Worker("js/worker.js");
                worker.onerror = (e) => {
                    worker.terminate();
                    reject(e);
                };
                worker.onmessage = (e) => {
                    worker.terminate();
                    resolve(e.data);
                }
                worker.postMessage({url:url,command:"getData"});
            } else {
                resolve(get_json(url));
            }
        });
    };


    // INPUT COMMAND PARSING /////////////////////////////////////

    // URL PARSER
    this.parseURL = function (url) {
        var parser = document.createElement('a'),
            params = {},
            queries, split, i;

        // Let the browser do the work
        parser.href = url;

        queries = parser.search.replace(/^\?/, '').split('&');
        for (i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            params[split[0]] = split[1];
        }

       return {
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                port: parser.port,
                pathname: parser.pathname,
                search: parser.search,
                params: params,
                hash: parser.hash
           };
    }


    // DATABASE OPERATIONS ///////////////////////////////////////
    this.create = function(database) {

        this.database = database || this.database;

        var db = new Dexie("friend_database");
            db.version(1).stores({
            friends: 'name,shoeSize'
        });
    };
    
    // STARTUP COMMANDS //////////////////////////////////////////

    // Parse the url, load the spec
    this.parsed = this.parseURL(this.url);
    this.database = this.load_spec();

}
