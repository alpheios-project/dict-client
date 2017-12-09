import {LanguageModelFactory, Definition} from 'alpheios-data-models'
import AlpheiosLexAdapter from './alpheios/alpheios_adapter'

export default class Lexicons {
  static async fetchShortDefs (lemma) {
    // TODO: Add a timeout
    let requests = []
    try {
      let adapters = Lexicons.getLexiconAdapters(lemma.languageID)
      requests = adapters.map(adapter => adapter.lookupShortDef(lemma))
    } catch (error) {
      console.log(`Unable to fetch short definitions due to: ${error}`)
      return []
    }

    return Promise.all(requests).then(
      values => {
        return values.map(value => new Definition(value.text, value.language, value.format))
      },
      error => {
        console.log(`Unable to fetch short definitions due to: ${error}`)
        return []
      }
    )
  }

  static async fetchFullDefs (lemma) {
    // TODO: Add a timeout
    let adapters = Lexicons.getLexiconAdapters(lemma.languageID)
    let requests = adapters.map(adapter => adapter.lookupFullDef(lemma))

    return Promise.all(requests).then(
      values => {
        return values.map(value => new Definition(value.text, value.language, value.format))
      },
      error => {
        console.error(error)
        throw new Error(error)
      }
    )
  }

  static getLexiconAdapters (languageID) {
    // As getLexicons need a language code, let's convert a language ID to a code
    let languageCode = LanguageModelFactory.getLanguageCodeFromId(languageID)

    let lexicons = AlpheiosLexAdapter.getLexicons(languageCode)
    return Array.from(lexicons.keys()).map(id => new AlpheiosLexAdapter(id))
  }
}
