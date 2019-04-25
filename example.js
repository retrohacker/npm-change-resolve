'use strict'

const follow = require('follow')
const queue = require('async').queue
const Registry = require('./index.js')
const registry = new Registry()

const registryQueue = queue(function (change, cb) {
  registry.get(change, cb)
}, 1)

follow({
  db: 'https://replicate.npmjs.com/registry',
  since: 0,
  inactivity_ms: 3600000
}, handleChange)

function handleChange (e, change) {
  if (change === undefined || change.seq === undefined) {
    return
  }

  registryQueue.push(change.id, console.log)
}
