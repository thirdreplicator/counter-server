var argv = require('attrs.argv')
var express = require('express')
var app = express()

var counter = {}
var PORT = argv.port || 3000

app.get('/', function (req, res) {
  res.json(counter)
})

app.get('/counters/:id', function (req, res) {
  const value = counter[req.params.id] == undefined ? 0 : counter[req.params.id]
  res.json(value)
})

app.post('/inc/:id', function (req, res) {
  if (counter[req.params.id] == undefined) { counter[req.params.id] = 0 }
  res.json(++(counter[req.params.id]))
})

app.post('/reset/all', function (req, res) {
	counter = {}
  res.json(counter)
})

app.post('/reset/:id', function (req, res) {
  counter[req.params.id] = 0
  res.json(0)
})

app.post('/reset/:id/:value', function (req, res) {
  counter[req.params.id] = parseInt(req.params.value)
  res.json(counter[req.param.value])
})

app.get('*', function(req, res){
  res.status(500).json({error: 'not found'})
})

if(!module.parent) { 
  app.listen(PORT, function () {
  	console.log('Counter server listening on port ' + PORT + '!')
  })
}

module.exports = app
