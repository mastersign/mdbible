const os = require('os')
const _ = require('lodash')
const magnalex = require('magnalexjs')
const textTransformation = require('gulp-text-simple')

const library = magnalex.library()

const defaultOptions = {
	// MagnaLex JS options
	refLanguage: 'en',
	formatLanguage: 'en',
	format: 'markdown',
	cssClass: 'mdbible',
	cssErrorClass: 'mdbible-error',
	latexQuoteEnvironment: 'quote',
	alwaysShowTranslation: false,
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
	return ref.format(library, opts)
}

function replaceQuotes(text, opts) {
	if (opts.defaultTranslation) library.setDefaultTranslation(opts.defaultTranslation)
    const blockPattern = /^\!\(\& ([^\)]+)\)\s*$/gm
    text = text.replace(blockPattern, (m, r) => blockQuote(r, opts) + os.EOL)
    const inlinePattern = /\(\& ([^\)]+)\)/gm
    text = text.replace(inlinePattern, (m, r) => inlineQuote(r, opts))
    return text
}

module.exports = textTransformation(replaceQuotes, defaultOptions)
