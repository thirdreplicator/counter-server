# Counter server

A REST server to emit unique incremented counters via HTTP POST request.  The same functionality can be obtained from a Redis server, but this is done in pure Node.js and can be embedded in an existing Node.js server.

## Install

npm install --save counter-server


## Usage

```javascript
var server = require('counter-server')
server.listen(3000)

```

You will need an http client to access the server.

## API

### GET /

Returns a hash-map of all counters and their values.

### POST /inc/:id

Incremements, then returns a counter value. Undefined counters are assumed to equal 0, so so 1 is returned upon incrementing an undefined counter. The POST data is empty.

### POST /reset/:id/:value

Sets a counter to a particular value. The POST data is empty.

### POST /reset/:id

Sets a counter to 0. The POST data is empty.

### POST /reset/all

Resets all counters to 0.  (Do not create counters named "all".) The POST data is empty.

## License

MIT
