# web-git

I've been interested in static technology, and specifically web-based functions that can perform some kind of computation or saving of data (database). I stumbled on [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), which is a client-side storage API for data structures (JSON). This basically means that we can save a data structure directly in the browser, meaning your (the user's) browser without any server. This is awesome for several reasons, mainly because we can make an application that provides some kind of API for the client, and the data stored in the API is specific to the client. I find this diabolical and awesome.

The user can use the static site as a REST API for his or her application, and easily create databases, and then interact with the data. The only functionality not possible with this API is sharing the data, however with (SOME OTHER API) we can push to a service (WHICH ONE??) to accomplish this!


# Installing the database
You can just use the [implementation that I've provided](http://vsoch.github.io/web-git) because, although it's served on my Github pages, all of the data lives in your browser (this is called "client side"), however you may want to deploy your own version, perhaps to tweak the code, or some other reason. In this sense, "installing" the database simply means deploying the pages in this repo to some static web space (your Github pages perhaps, or another web server).

# Using the database

## Interactively
If you visit the page being served with an installation of a database...
TODO: add all functions on page (using spec.json in js folder) to add/update etc.data

## Programatically
The database, which is an indexedDB, is "talked to" via the URL that is called to your page. Given that we can add variables to a URL, for example,the url:

      http://vsoch.github.io/web-git?database=hello

would be passing the variable `database` to the page with value `hello` (the name of the database). We can also specify multiple variables by way of the `&` symbol:

      http://vsoch.github.io/web-git?database=hello&version=2

This kind of interaction is called a [RESTful web service](https://en.wikipedia.org/wiki/Representational_state_transfer), which means representational state transfer, and is the way that we can pass information, or even call functions, simply by way of a URL. Thus, in order to use your web-git databases in a programmatic way, you simply need to know how to customize your URL. You can learn about the different (default) options by way of the [parameter specs](js/spec.json).

# Parameter Specs

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

Remember that you can specify
