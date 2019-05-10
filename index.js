/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License.
See LICENSE file.
*/

const got = require('got')
const url = require('url')
const normalize = require('normalize-registry-metadata')

const defaultConfig = {
  'ua': 'npm-registry-follower',
  'protocol': 'https:',
  'registry': 'replicate.npmjs.com/registry'
}

module.exports = class registry {
  constructor (c) {
    const self = this
    const config = c || {}
    self.config = {
      ua: config.ua || defaultConfig.ua,
      protocol: config.protocol || defaultConfig.protocol,
      registry: config.registry || defaultConfig.registry
    }
  }
  get (id, callback) {
    const self = this
    self.getDoc(id, function (err, doc) {
      if (err) return callback(err)
      const info = self.split(doc)
      return callback(err, info)
    })
  }
  getDoc (id, callback) {
    const self = this
    const opt = {
      url: url.format({
        protocol: self.config.protocol,
        hostname: self.config.registry,
        pathname: id
      }),
      json: true,
      headers: {
        'user-agent': self.config.ua
      }
    }
    return got
      .get(opt, { json: true })
      .then((resp) => {
        callback(null, resp.body)
      })
      .catch((e) => {
        if (e) {
          return callback(e)
        }
      })
  }
  splitVersions (json) {
    const parts = []

    function addVersionAs (name, version) {
      const versionJson = json.versions[version]
      if (typeof versionJson === 'undefined') {
        return
      }
      parts.push({
        version: name,
        json: JSON.parse(JSON.stringify(versionJson))
      })
    }

    if (json['dist-tags']) {
      Object.keys(json['dist-tags']).forEach(function (name) {
        const tag = json['dist-tags'][name]
        addVersionAs(name, tag)
      })
    }
    if (json.versions) {
      Object.keys(json.versions).forEach(function (name) {
        addVersionAs(name, name)
      })
    }
    return parts
  }
  splitTarballs (doc) {
    return doc.versions ? Object.keys(doc.versions).map(function (v) {
      const item = doc.versions[v]
      return {
        path: url.parse(item.dist.tarball).pathname,
        tarball: item.dist.tarball,
        shasum: item.dist.shasum
      }
    }) : []
  }
  split (doc) {
    const self = this
    normalize(doc)
    return {
      json: doc,
      versions: self.splitVersions(doc),
      tarballs: self.splitTarballs(doc)
    }
  }
}
