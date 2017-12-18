/**
 * Base Adapter Class for a Lexicon Service
 */
class BaseLexiconAdapter {
  /**
   * Lookup a short definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Promise} a Promise that resolves to an array Definition objects
   */
  async lookupShortDef (lemma) {
    throw new Error('Unimplemented')
  }

  /**
   * Lookup a full definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Promise} a Promise that resolves to an array of Definition objects
   */
  async lookupFullDef (lemma) {
    throw new Error('Unimplemented')
  }

  /**
   * Get the available lexicons provided by this adapter class for the
   * requested language
   * @param {string} language languageCode
   * @return {Array} a Map of lexicon objects. Keys are lexicon uris, values are the lexicon description.
   */
  static getLexicons (language) {
    return []
  }
}

export default BaseLexiconAdapter
