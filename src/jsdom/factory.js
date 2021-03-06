'use strict'

const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
const Console = require('../Console')
const ResourceLoader = require('./ResourceLoader')
const { $settings } = require('./../mindom/const')

module.exports = settings => {
  const virtualConsole = new jsdom.VirtualConsole()
  virtualConsole.sendTo(new Console(settings))
  const window = new JSDOM('', {
    url: settings.baseURL,
    referrer: settings.baseURL,
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
    runScripts: 'dangerously',
    resources: new ResourceLoader(settings),
    virtualConsole: virtualConsole,
    beforeParse: window => {
      // Compatibility layer (see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming/fetchStart)
      window.performance.timing = {
        navigationStart: new Date().getTime(),
        fetchStart: new Date().getTime()
      }
      // Use custom XMLHttpRequest
      window.XMLHttpRequest = require('./XMLHttpRequest')(settings)
    }
  }).window
  window[$settings] = settings
  return window
}
