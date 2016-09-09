// Web-git is a wrapper for Dexie.js --> indexedDB to implement
// a JavaScript-based REST API that stores data client side.

function webGit(database) {

    this.database = database;
    this.changeName = function (name) {
        this.lastName = name;
    };

    // URL PARSER
    //https://www.abeautifulsite.net/parsing-urls-in-javascript
    this.parseURL = function (url) {
        var parser = document.createElement('a'),
            params = {},
            queries, split, i;

        // Let the browser do the work
        parser.href = url;

        // Convert query string to object
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
}
