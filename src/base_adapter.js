/**
 * Base Adapter Class for a Lexicon Service
 */
class BaseLexiconAdapter {
  /**
   * Lookup a short definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Definition} a Definition object
   */
  async lookupShortDef (lemma) {

  }

  /**
   * Lookup a full definition in a lexicon
   * @param {Lemma} lemma Lemma to lookup
   * @return {Promise} a Promise that resovles to a Definition object
   */
  async lookupFullDef (lemma) {

  }
}

export default BaseLexiconAdapter
