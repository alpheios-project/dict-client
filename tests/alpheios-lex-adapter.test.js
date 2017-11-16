/* eslint-env jest */
'use strict'
import AlpheiosLexAdapter from '../src/alpheios-lex-adapter.js'

describe('BaseAdapter object', () => {
  beforeAll(() => {
    window.fetch = require('jest-fetch-mock')
  })

  test('default config', () => {
    let adapter = new AlpheiosLexAdapter('lsj')
    expect(adapter.getConfig('short')).toBeTruthy()
  })

  test('default config', () => {
    let adapter = new AlpheiosLexAdapter('lsj', {short: 'dummyurl'})
    expect(adapter.getConfig('short')).toEqual('dummyurl')
  })

  test('getFullDef', () => {
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = '<div n="abc">my def</div>'
    window.fetch.mockResponse(dummyResponse)
    adapter.lookupFullDef('mare').then((response) => {
      expect(response).toEqual(dummyResponse)
    })
  })

  test('load data', () => {
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = {'foo': 'bar'}
    window.fetch.mockResponse(JSON.stringify(dummyResponse))
    adapter.lookupShortDef('mare').then((response) => {
      expect(adapter.data).toBeTruthy()
    })
  })
})
