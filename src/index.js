const os = require('os')
const _ = require('lodash')
const magnalex = require('magnalexjs')
const textTransformation = require('gulp-text-simple')

const library = magnalex.library()

const defaultOptions = {
	// MagnaLex JS options
	refLanguage: 'en',
	language: 'en',
	format: 'markdown',
	cssClass: 'mdbible',
	cssErrorClass: 'mdbible-error',
	latexQuoteEnvironment: 'quote',
	alwaysShowTranslation: false,
	fullTranslationName: false,
	useOriginalBookName: false,
	translateBookName: true,
	fullBookName: false,
	// MdBible options
	defaultTranslation: 'KJV',
}

function error(msg) {
	return '**\\[MdBible] ' + msg + '**'
}

function blockQuote(r, opts) {
	const ref = library.parseReference(r, opts.refLanguage)
	if (!ref) return error('Invalid Bible Reference: "' + r + '"', opts)
	const verses = library.loadVerses(ref)
	if (_.isEmpty(verses)) return error('Bible Reference Not Found: "' + r + '"', opts)
	switch (opts.format) {
		case 'markdown':
			return library.toMarkdown(ref, verses, opts)
		case 'html':
			return '~~~{=html}\n' +
				library.toHTML(ref, verses, opts) +
				'\n~~~'
		case 'tex':
			return '~~~{=tex}\n' +
				library.toLaTeX(ref, verses, opts) +
				'\n~~~'
		default:
			throw new Error('Unsupported format: ' + opts.format)
	}
}

function inlineQuote(r, opts) {
	const ref = library.parseReference(r, opts.refLanguage)
	if (!ref) return error('Invalid Bible Reference: "' + r + '"', opts)
	const quoteSrcOpts = library.setupQuoteSourceOptions(ref, ref.translation ? ref : null, opts)
	return ref.format(library, quoteSrcOpts)
}

function listOfLanguages() {
	return _.join(
		_.map(
			_.values(library.languages),
			l => l.langTag === library.defaults.langTag ?
				`* **${l.langTag}**` :
				`* ${l.langTag}`),
		os.EOL)
}

function listOfTranslations() {
	return _.join(
		_.map(
			_.values(library.translations),
			t => t.shortName === library.defaults.translation ?
				`* \`${t.shortName}\` **${t.name}**` :
				`* \`${t.shortName}\` ${t.name}`),
		os.EOL)
}

function listOfBooks(opts) {
	const l = library.getLanguage(opts.language)
	return _.join(
		_.map(
			_.values(l.books),
			bn => `* \`${bn.id}\` ${bn.shortName} -- ${bn.name}`),
		os.EOL)
}

function replaceQuotes(text, opts) {
    const languageListPattern = /^\!\(\& languages\)\s*$/gm
    const translationListPattern = /^\!\(\& translations\)\s*$/gm
    const bookListPattern = /^\!\(\& books\)\s*$/gm
    const blockPattern = /^\!\(\& ([^\)]+)\)\s*$/gm
    const inlinePattern = /\(\& ([^\)]+)\)/gm
    text = text.replace()
	if (opts.defaultTranslation) library.setDefaultTranslation(opts.defaultTranslation)
	text = text.replace(languageListPattern, () => listOfLanguages() + os.EOL)
	text = text.replace(translationListPattern, () => listOfTranslations() + os.EOL)
	text = text.replace(bookListPattern, () => listOfBooks(opts) + os.EOL)
    text = text.replace(blockPattern, (m, r) => blockQuote(r, opts) + os.EOL)
    text = text.replace(inlinePattern, (m, r) => inlineQuote(r, opts))
    return text
}

module.exports = textTransformation(replaceQuotes, defaultOptions)
