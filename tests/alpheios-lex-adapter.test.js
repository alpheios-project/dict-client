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

  test('lookup enforced capital', () => {
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = '@Εὐκράς|n44301\n@εὐκτέανος1|n44329\n@εὐκτέανος2|n44330\nεὐκράς1|@\nεὐκράς2|@\nεὐκράς|@\nεὐκτέανος2|@\nnontrailing|n99999'
    window.fetch.mockResponse(dummyResponse)
    adapter.lookupShortDef('Εὐκράς').then((response) => {
      expect(response).toEqual('n44301')
    })
    adapter.lookupShortDef('εὐκτέανος2').then((response) => {
      expect(response).toEqual('n44330')
    })
    adapter.lookupShortDef('nontrailing1').then((response) => {
      expect(response).toEqual('n99999')
    })
  })
})
