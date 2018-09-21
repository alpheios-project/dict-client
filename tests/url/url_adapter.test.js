/* eslint-env jest */
'use strict'
import UrlLexAdapter from '../../src/url/url_adapter.js'
import { Constants } from 'alpheios-data-models'

describe('BaseAdapter object', () => {
  beforeAll(() => {
    jest.resetModules()
    window.fetch = require('jest-fetch-mock')
  })

  test('getFullDef', async () => {
    let mockLemma = {
      word: 'mare',
      language: Constants.LANG_LATIN,
      principalParts: [],
      features: {
        source: { value: 'https://example.org/lexicon/mare' }
      }
    }
    let adapter = new UrlLexAdapter()
    let dummyResponse = '<div n="abc">my def</div>'
    window.fetch.mockResponse(dummyResponse)
    let response = await adapter.lookupFullDef(mockLemma)
    expect(response[0].text).toEqual(dummyResponse)
    expect(response[0].lemmaText).toEqual('mare')
  })
})
