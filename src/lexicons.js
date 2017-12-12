import {LanguageModelFactory, Definition} from 'alpheios-data-models'
import AlpheiosLexAdapter from './alpheios/alpheios_adapter'

export default class Lexicons {
  static get defaults () {
    return {
      timeout: 10000
    }
  }

  static async fetchShortDefs (lemma, options) {
    return Lexicons.fetchDefinitions(lemma, options, 'lookupShortDef')
  }

  static async fetchFullDefs (lemma, options) {
    return Lexicons.fetchDefinitions(lemma, options, 'lookupFullDef')
  }

  static async fetchDefinitions (lemma, options, lookupFunction) {
    let config = Object.assign(Lexicons.defaults, options)

    let requests = []
    try {
      let adapters = Lexicons.getLexiconAdapters(lemma.languageID)
      requests = adapters.map(adapter => {
        console.log(`Preparing a request to "${adapter.config.description}"`)
        // This promise is never rejected. For errors and timeouts, it will return `undefined` instead of a Definition object
        return new Promise((resolve) => {
          let timeout = window.setTimeout(() => {
            console.warn(`Timeout of ${config.timeout} ms has been expired for a request to "${adapter.config.description}"`)
            resolve(undefined)
          }, config.timeout)

          adapter[lookupFunction](lemma)
            .then(value => {
              console.log(`A definition object has been returned from "${adapter.config.description}"`)
              // value is a Definition object wrapped in a Proxy
              window.clearTimeout(timeout)
              resolve(new Definition(value.text, value.language, value.format))
            }).catch(error => {
              console.error(`Error from a request to "${adapter.config.description}": ${error}`)
              window.clearTimeout(timeout)
              resolve(undefined)
            })
        })
      })
    } catch (error) {
      console.log(`Unable to fetch full definitions due to: ${error}`)
      return []
    }

    return Promise.all(requests).then(
      values => {
        console.log(`All promises have been resolved`, values)
        return values.filter(value => {
          return value
        })
      },
      error => {
        // This should never happen because requests are never rejected but just in case
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
