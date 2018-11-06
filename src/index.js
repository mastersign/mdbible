const os = require('os')
const _ = require('lodash')
const magnalex = require('magnalexjs')
const textTransformation = require('gulp-text-simple')

const library = magnalex.library()

const defaultOptions = {
	refLanguage: 'en',
	formatLanguage: 'en',
	format: 'markdown',
	cssClass: 'mdbible',
	cssErrorClass: 'mdbible-error',
}

function error(msg, opts) {
	switch (opts.format) {
		case 'markdown':
			return '**' + msg + '**'
		case 'html':
			return '<p class="' + opts.cssErrorClass + '">' + msg + '</p>'
		default:
			throw new Error('Unsupported format: ' + opts.format)
	}
}

function blockQuote(r, opts) {
	const ref = library.parseReference(r, opts.refLanguage)
	if (!ref) return error('Invalid Bible Reference: "' + r + '"', opts)
	const verses = library.loadVerses(ref)
	if (_.isEmpty(verses)) return error('Bible Reference Not Found: "' + r + '"', opts)
	switch (opts.format) {
		case 'markdown':
			return library.toMarkdown(ref, verses, opts.formatLanguage)
		case 'html':
			return library.toHTML(ref, verses, opts.formatLanguage, opts.cssClass)
	}
}

function replaceQuotes(text, opts) {
    const pattern = /^\!\(\& ([^\)]+)\)\s*$/gm
    text = text.replace(pattern, (m, r) => blockQuote(r, opts) + os.EOL)
    return text
}

module.exports = textTransformation(replaceQuotes, defaultOptions)
