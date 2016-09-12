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

function webGit(url,specfile,schemafile) {

    // webGit init should take the url... if not defined, used document.URL
    this.url = url || document.URL;
    this.specfile = specfile || "spec.json";
    this.schemafile = schemafile || "schema.json";

    // State variables
    this.rundone = false;
    this.schemadone = false

    // Timestamp setter, seconds
    this.now = function() {
        return Math.floor(Date.now() / 1000)
    }


    // COMMAND SPEC FUNCTIONS ////////////////////////////////////

    // Load the spec (commands) into the object
    this.load_spec = function(url) {

        var url = url || this.specfile
        var holder = this;
        return this.load_url(url).then(function(spec){
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
            console.log(database);
            holder.params = database;
            return Promise.resolve()
        })
        
    }

    // Load an initial database schema
    this.load_schema = function(url) {

        var url = url || this.schemafile;
        console.log(url);
        var holder = this;

        if (holder.schemadone == false) {
            return this.load_url(url).then(function(schema){
                holder.schema = schema;
                return Promise.resolve();
            })
        } 
        // schema already loaded!
        return Promise.resolve();      

    }

    this.update_schema = function(schema) {
        var schema = schema || this.schema;
        console.log("UPDATING SCHEMA:");
        console.log(schema);

        // Create datastructure from schema
        var tables = {};
        schema.tables.forEach(function(table){
            tables[table.name] = table.fields
        });

        // Update the schema
        this.db.version(this.params.version).stores(tables);
        return Promise.resolve();
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

        wb = this;
        return new Promise(function(resolve,reject){

            // Let the browser do the work
            parser.href = url;

            queries = parser.search.replace(/^\?/, '').split('&');
            for (i = 0; i < queries.length; i++ ) {
                split = queries[i].split('=');
                var key = split[0].replace('/','');
                    
                // If the parameter isn't given with an arg (eg, drop)
                if (split.length == 1) {
                    params[key] = "";
                } else {
                    
                    // removes trailing slashes
                    var value = split[1].replace('/','');

                    params[key] = value;

                    // If the user specifies the database, set it
                    if (key == "database"){
                        console.log("Found database params...");
                        wb.params.database = value;
                    }
 
                    // If the user specifies the version, set it
                    if (key == "version"){
                        var version = parseInt(value);
                        if (Number.isInteger(version)){
                            console.log("Found version params...");
                            wb.params.version = version;
                        }
                    }

                   // If the user specifies stores, create the schema
                    if (key == "stores"){
                        var stores = value.split('||');
                        var tables = [];
                        stores.forEach(function(table){
                            console.log(table);
                            tfields = table.split('|');
                            if (tfields.length == 2){
                                var entry = {"name":tfields[0],
                                             "fields":tfields[1]}
                                tables.push(entry);                          
                            }
                        });

                        // Update the schema
                        wb.schema = {"tables":tables};
                        wb.schemadone = true;
                    }
                }

            }

            wb.parsed = {
                            protocol: parser.protocol,
                            host: parser.host,
                            hostname: parser.hostname,
                            port: parser.port,
                            pathname: parser.pathname,
                            search: parser.search,
                            params: params,
                            hash: parser.hash
                        };

            resolve();

        })
    }


    // DATABASE OPERATIONS ///////////////////////////////////////
    this.create = function(params) {
        this.params = params || this.params;
        console.log("Creating database " + this.params.database);
        this.db = new Dexie(this.params.database)
        return Promise.resolve(this.db);
    };

    // Delete a database
    this.delete = function() {
        console.log("Deleting database " + this.db.name);
        this.db.delete().then(function(){
            return Promise.resolve();
        }).catch(function(e){
           console.log(e); 
           //return Promise.reject(e);
        })
    };

    // Main controller for executing commands
    this.run = function() {
        console.log("USER PROVIDED COMMANDS:");
        var commands = this.parsed.params;
        console.log(commands);

        // Commands will go in as an array of promises
        // need to think about: if user should be adding one at a time? probably...
        var promises = [];

        // For each command, if it's in allowable commands, run it
        for (command in commands) {
            if (commands.hasOwnProperty(command)){
                if (this.params.command.indexOf(command) > -1){
                    var param = commands[command];

                    // If valid command, take appropriate action here
                    if (command=="drop"){
                        console.log('DROPPING DATABASE.');
                        wb.delete();
                    }
                }
            }
        }
        this.rundone = true;
    }
    
    // PRINT / VERBOSE FUNCTIONS /////////////////////////////////
    this.print = function(db,printTables) {
        db = db || this.db
        printTables = printTables || false;
        return db.open().then(function (db) {
            console.log ("Found database: " + db.name);
            console.log ("Database version: " + db.verno);
            db.tables.forEach(function (table) {
                console.log ("Found table: " + table.name);
                if (printTables == true) {
                    console.log ("Table Schema: " + JSON.stringify(table.schema, null, 4));
                }
            });
        }).catch('NoSuchDatabaseError', function(e) {
            return Promise.reject(e) 
        }).catch(function (e) {
            return Promise.reject(e)
        })
    }

    // STARTUP COMMANDS //////////////////////////////////////////

    // Parse the url, load the spec, create the database
    wb = this;

    // load_spec,updated with URL params, load schema, and then run commands
    this.load_spec().then(function(){
        wb.parseURL(wb.url).then(function(){ 
            wb.create().then(function() {
                wb.load_schema().then(function(){
                    // Try opening, if there is error, update the schema
                    wb.db.open().catch(function(e){
                        console.log("Creating initial database schema...");
                        // If database not found, create it
                        wb.update_schema(wb.schema).then(function(){
                            wb.run();
                        });
                    // If open is successful, just get and run commands
                    }).then(function(){
                        if (wb.rundone == false){
                            wb.run();
                        }
                    })
                })
            })
        })
    });
}
