/* eslint-env jest */
'use strict'
import Lexicons from '../src/lexicons.js'
import { LanguageModelFactory } from 'alpheios-data-models'
let lsj = 'https://github.com/alpheios-project/lsj'
let ml = 'https://github.com/alpheios-project/ml'

describe('Lexicons', () => {
  beforeAll(() => {
    jest.resetModules()
    window.fetch = require('jest-fetch-mock')
  })

  test('_filterAdapters', () => {
    let mockLemma = {
      languageID: LanguageModelFactory.getLanguageIdFromCode('grc'),
      word: 'dummy',
      features: {}
    }
    let adapters = Lexicons._filterAdapters(mockLemma, {})
    expect(adapters.length).toEqual(5)
    expect(adapters.map((a) => { return a.lexid }).includes(lsj)).toBeTruthy()
    expect(adapters.map((a) => { return a.lexid }).includes(lsj)).toBeTruthy()
    adapters = Lexicons._filterAdapters(mockLemma, { allow: [ml] })
    expect(adapters.length).toEqual(1)
    expect(adapters.map((a) => { return a.lexid }).includes(lsj)).toBeFalsy()
    expect(adapters.map((a) => { return a.lexid }).includes(ml)).toBeTruthy()
  })
  test('_filterAdapters with url source', () => {
    let mockLemma = {
      languageID: LanguageModelFactory.getLanguageIdFromCode('gez'),
      word: 'dummy',
      features: { source: { value: 'https://example.org/lex/a' } }
    }
    let adapters = Lexicons._filterAdapters(mockLemma, {})
    expect(adapters.length).toEqual(1)
    expect(adapters[0].config.description).toEqual('URL Lexicon Adapter')
  })
})
