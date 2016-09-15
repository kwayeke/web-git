# web-git

I've been interested in static technology, and specifically web-based functions that can perform some kind of computation or saving of data (database). I stumbled on [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), which is a client-side storage API for data structures (JSON). This basically means that we can save a data structure directly in the browser, meaning your (the user's) browser without any server. This is awesome for several reasons, mainly because we can make an application that provides some kind of API for the client, and the data stored in the API is specific to the client. I find this diabolical and awesome.

The user can use the static site as a REST API for his or her application, and easily create databases, and then interact with the data. The only functionality not possible with this API is sharing the data, however with (some other API?) we can push to (some) service to accomplish this! This is by no means a complete application, but an example of what can be accomplished with a simple browser-based database. I hope that this example can inspire cool applications that might require local, flexible, data storage! I most definitely expect to take this in a few directions for some cool projects I have in mind :) I still need to do basic things like implement an update function, and add checks to make sure a database is not reset (when the browser is refreshed and it is created anew). These things are all controllable and customizable, depending on your application needs.

# A few use cases

## RESTful API for Desktop applications
You would write some (python, R, other) module that wraps some version of the [RESTful API example](http://vsoch.github.io/web-git) to send and retrieve data from a static URL serving web-git to your application. This would mean that the user can mess around with stuff in your application, and dynamically save the data to a browser-based database. They can close Python/R/whatever, and come back later (from a different directory) and their database will still be there, given that they are using the same computer. What will you do with the data in the browser? You could:

- Provide a cool visualization/rendering of the data, one that updates in real time when the user changes the database
- Use a third party API (eg [Dropbox](https://www.dropbox.com/developers)) to export data in other formats (or places)

Why is this useful? Many applications would be enhanced by simple web technologies, for example interactive visualization. Many applications might want to offer webGL or other renderings of data to a user, and provide a simple static page to serve that. Yes, this means that the same URL will work for a single application across all users, because each user stores his or her own data. Finally, it means that a user can use an application with (some) private or proprietary data, because it's (still) stored on his or her machine.

## RESTful API for Browser Applications
There isn't any reason that the API call has to be from a user's desktop - it could easily come from another web application. Essentially, this kind of solution would offer a browser-based database for whatever kind of data you can send via a URL.

## Version Control in the browser
The reason it is called web-git is because the databases can have different versions, and I foresee being able to implement some kind of browser based version control. Yes, Github works fine, but I've encountered different times when I'm working with something in a browser, and it would have been nice to be able to save some temporary state to pick up on later.

## Custom Visualizations for Private Data
Working in Stanford Medicine for many years, time and time again there is an issue of data privacy. We can store data in secured places, and on encrypted machines, but when it comes to databases, red flags are thrown because this usually means "online somewhere" which breaches some security protocol. On the other hand, think of the many cases when a researcher, or physician, might have some data locally on a machine, and would want to quickly run it through an analysis and see a result. This would work under this kind of model.


# Installing the database
You can just use the [basic demo that I've provided](http://vsoch.github.io/web-git) because, although it's served on my Github pages, all of the data lives in your browser (this is called "client side"), and likely you will want to deploy your own version with your application / functionality of interest. In this sense, "installing" the database simply means deploying the pages in this repo to some static web space (your Github pages perhaps, or another web server) and then modifying the html/javascript to do something special with your database(s). When you make your own application, you will likely want to have your database initialized with specific Tables, in which case you should [edit the spec file](https://github.com/vsoch/web-git#parameter-specs). If you want to control the functions the user can access, you will want to edit the [schema](https://github.com/vsoch/web-git#database-schema).

# Using the database

## Interactively
The [basic demo that I've provided](http://vsoch.github.io/web-git) has some buttons that will show basic functionality, but it's pretty limited. I'm going to be building something more interesting at some point, but until

If you visit the page being served with an installation of a database...
TODO: add all functions on page (using spec.json in js folder) to add/update etc.data

## Programatically
The database, which is an indexedDB, is "talked to" via the URL that is called to your page. Given that we can add variables to a URL, for example,the url:

      http://vsoch.github.io/web-git?database=hello

would be passing the variable `database` to the page with value `hello` (the name of the database). We can also specify multiple variables by way of the `&` symbol:

      http://vsoch.github.io/web-git?database=hello&version=2

This kind of interaction is called a [RESTful web service](https://en.wikipedia.org/wiki/Representational_state_transfer), which means representational state transfer, and is the way that we can pass information, or even call functions, simply by way of a URL. Thus, in order to use your web-git databases in a programmatic way, you simply need to know how to customize your URL. You can learn about the different (default) options by way of the [parameter specs](js/spec.json).

# Parameter Specs

The default specs are loaded from [the spec file](js/spec.json), which looks like this:

      {
          "database":{
              "description":"the name of the database to create or connect to.",
              "default":"default"
           },
          "version":{
              "description":"the version of the database to use.",
              "default":1
          },
          "command":{
              "description":"the command to issue to the database.",
              "default":["add","delete","update","drop","dropall","stores"]
          }
     }

meaning that if you deploy this on your own server or Github pages, you can edit those values to change the default database and version, and change the default commands the user can access. Since this is a RESTful API, the user (you!) can change the active database or version, OR run commands as follows:


## database
This specifies the name of the database. To override, you would add the database variable to the url, like:

      http://vsoch.github.io/web-git?database=hello

The default name is defined in the `database` variable under the field "default" and it is "default"

## version
This specifies the database version, which must be an integer. To override, you would add the version variable to the url, like:

      http://vsoch.github.io/web-git?version=2

The default version number is defined in the `version` variable under the field "default" and it is the value 1.

## commands
All other commands, meaning variables in the URL, will be run in the sequence provided. For example, if you do an `add` and then a `delete` operation for the same entry, it will be added and deleted. If you do `delete` and then `add` you are going to trigger an error.


# Database Schema
The default schema used for the initially created database is defined in [js/schema.js](js/schema.js), and it's a simple list of tables, each of which has a name and fields:

      {
        "tables": [
          {
            "name": "friends",
            "fields": "name,shoeSize"
          }
        ]
      }


Right now, specifying a string for the fields, and the name of the table is what is supported. See [here](https://github.com/dfahlander/Dexie.js/wiki/Version.stores()) for more examples of how to customize the fields string to specify unique ids, etc. I expect this schema format will be further developed as needed.

# Command examples

The default commands are those that you would expect with a database, adding, deleting, and customizing the structure of your tables.

## database
You can specify the database name to use with the `database` parameter. For example, here we are opening a database called "hello":

      http://vsoch.github.io/web-git?database=hello


## version
You can have multiple verisons of the same database. For details, read about versioning [here](). While this function seems more fit for applications that need to support changing a database after an application is deployed (and not wanting to destroy "version 1.0 user data) there are definitely use cases for it here. Please post an issue or contact @vsoch if you have good examples. To specify the version, use the version url parameter:

      http://vsoch.github.io/web-git?version=1


Note that the version must be an integer. If you pass a string, it will turn into NaN when parsed into an int, and not be used to set the variable.

## drop
The drop parameter will delete the database, and you don't need to specify a second argument, although if you do, it will just be ignored. Here we will create and drop a database called "meatballs".

      http://vsoch.github.io/web-git?database=meatballs&drop

You can also drop all databases that were stored in the browser, either via URL:

      http://vsoch.github.io/web-git?database=meatballs&dropall

or via the command console (given that the wb variable is exposed)

      wb.deleteAll();


## show
You can show (or print) all tables (and the entire database as a JSON object) with the "show" command:

      http://vsoch.github.io/web-git?database=meatballs&show


## stores
A database "store" is another name for a table. The default stores (tables) are determined from schema.json, but you can also set this information via the URL. The basic format looks like `table|field1,field2,field3` where `table` is the name of the table, and the field names follow the guidlines defined [here](). To specify more than one store, you can string them together with double `||`:

      tableA|fieldA1,fieldA2,fieldA3||tableB|fieldB1,fieldB2,fieldB3

This was my simple solution to parsing table and field names from a URL - if you have suggestions for an improvement please contribute! Thus, to specify tables (stores) it would look something like this:

      http://vsoch.github.io/web-git?stores=sandwiches|bread,filling,spread||cookies|size,flavor,mixins


## add
You can add entries (think of them as rows) to a specific table in your database similarly to how you would specify stores. The basic format looks like `table|field1:value1,field2:value2,field3:value2` where `table` is the name of the table, and each field:value pair is separated by a comma. If a table or field is not found in the database, it won't be added. So for example, to add an entry to our cookies table:

      http://vsoch.github.io/web-git?add=cookies|size:small,flavor:chocolate,mixins:vanilla


# Final Notes and Issues
Please note that as currently implemented in the demo, refreshing the page will re-create the default (or selected) database, and "erase" any changes you've made to it (records, tables, etc) because the new URL (with commands) is automatically parsed. The reason for this is that I can see either functionality (having data endure or resetting at each session start) to be useful, depending on the application. What are some easy solutions? 

1. There could be a parameter that specifies loading defaults, and re-creating databases (or not)
2. The single session (and reset on page reload) could be default, and then have most commands to work with the database run interactively in the browser. This removes the functionality that I wanted, namely having a local RESTful API sort of deal to talk to an (enduring) database, but given that the application is single-use, likely the RESTful API database isn't the desired functionality.
3. Create a "login" process where the user generates the database at login, and then selects a database. Then, all following operations are assumed that the database is created.

I will likely develop a second interface (with some more specific application) that does one of the following. Until then, just know that refreshing the page is like a database reset. 

# Demo
The basic demo version of the above commands can be [viewed online](http://vsoch.github.io/web-git)! I'd like to make a shout out to the [skeleton](http://getskeleton.com/) framework for it's beauty and simpicity. A second shout out to [Dexie](https://github.com/dfahlander/Dexie.js/wiki/API-Reference) for such an awesome API! Note that you will need to open your browser to see minimal output, and the "wb" variable isn't exposed beyond a `console.log(wb)`. Please let me know if you think of cool applications (post an issue or comment) and otherwise rest assured I'll be developing something cool with this, eventually!
