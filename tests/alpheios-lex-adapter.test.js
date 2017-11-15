/* eslint-env jest */
'use strict'
import AlpheiosLexAdapter from '../src/alpheios-lex-adapter.js'

describe('BaseAdapter object', () => {
  let adapter

  beforeAll(() => {
    window.fetch = require('jest-fetch-mock')
    adapter = new AlpheiosLexAdapter('lsj')
  })

  test('load config', () => {
    expect(adapter.getConfig('short')).toBeTruthy()
  })

  test('load data', () => {
    let dummyResponse = {'foo': 'bar'}
    window.fetch.mockResponse(JSON.stringify(dummyResponse))
    adapter.lookupShortDef('mare').then((response) => {
      expect(adapter.data).toBeTruthy()
    })
  })
})
