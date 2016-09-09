// Web-git is a wrapper for Dexie.js --> indexedDB to implement
// a JavaScript-based REST API that stores data client side.

// 1. come up with a formal spec for params to talk to dexie functions
// 2. create html/web view to use CRUD hooks to update user on status of that
// 3. figure out version control
// 4. add interactive elements to upload data in different ways, export data, plot data, etc.
// 5. add interactive elements to view databases, select / change active database, delete database
// 6. how can we add version control? can we integrate github?

function webGit(url) {

    // webGit init should take the url... if not defined, used document.URL
    this.url = url || document.URL

    // Timestamp setter, seconds
    this.now = function() {
        return Math.floor(Date.now() / 1000)
    }

    // URL PARSER
    // https://www.abeautifulsite.net/parsing-urls-in-javascript
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

    // Parse the url
    this.parsed = this.parseURL(this.url);
}

/* To set and get different data objects
var o = {
  a: 7,
  get b() { 
    return this.a + 1;
  },
  set c(x) {
    this.a = x / 2
  }
};

console.log(o.a); // 7
console.log(o.b); // 8
o.c = 50;
console.log(o.a); // 25
*/
