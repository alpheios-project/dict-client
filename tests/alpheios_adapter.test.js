/* eslint-env jest */
'use strict'
import AlpheiosLexAdapter from '../src/alpheios_adapter.js'

describe('BaseAdapter object', () => {
  beforeAll(() => {
    window.fetch = require('jest-fetch-mock')
  })

  test('default config', () => {
    let adapter = new AlpheiosLexAdapter('lsj')
    expect(adapter.getConfig('shortUrl')).toBeTruthy()
  })

  test('default config', () => {
    let adapter = new AlpheiosLexAdapter('lsj', {short: 'dummyurl'})
    expect(adapter.getConfig('short')).toEqual('dummyurl')
  })

  test('getFullDef', async () => {
    let mockLemma = {
      word: 'mare',
      language: 'lat',
      principalParts: []
    }
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = '<div n="abc">my def</div>'
    window.fetch.mockResponse(dummyResponse)
    let response = await adapter.lookupFullDef(mockLemma)
    expect(response.text).toEqual(dummyResponse)
  })

  test('load data', async () => {
    let mockLemma = {
      word: 'mare',
      language: 'lat',
      principalParts: []
    }
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = {'foo': 'bar'}
    window.fetch.mockResponse(JSON.stringify(dummyResponse))
    await adapter.lookupShortDef(mockLemma)
    expect(adapter.data).toBeTruthy()
  })

  test('lookup enforced capital', async () => {
    let mock = {
      word: 'Εὐκράς',
      language: 'grc',
      principalParts: []
    }
    let mock2 = {
      word: 'εὐκτέανος2',
      language: 'grc',
      principalParts: []
    }
    let mock3 = {
      word: 'nontrailing1',
      language: 'grc',
      principalParts: []
    }
    let adapter = new AlpheiosLexAdapter('lsj')
    let dummyResponse = '@Εὐκράς|n44301\n@εὐκτέανος1|n44329\n@εὐκτέανος2|n44330\nεὐκράς1|@\nεὐκράς2|@\nεὐκράς|@\nεὐκτέανος2|@\nnontrailing|n99999'
    expect.assertions(3)
    window.fetch.mockResponse(dummyResponse)
    let response = await adapter.lookupShortDef(mock)
    expect(response.text).toEqual('n44301')
    let response2 = await adapter.lookupShortDef(mock2)
    expect(response2.text).toEqual('n44330')
    let response3 = await adapter.lookupShortDef(mock3)
    expect(response3.text).toEqual('n99999')
  })
})
