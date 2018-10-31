const os = require('os')
const _ = require('lodash')
const magnalex = require('magnalexjs')
const textTransformation = require('gulp-text-simple')

const library = magnalex.library()

function blockQuote(r, opts) {
	const ref = library.parseReference(r, opts.refLanguage)
	if (!ref) return '**Invalid Bible Reference: "' + r + '"**'
	const verses = library.loadVerses(ref)
	if (_.isEmpty(verses)) return '**Bible Reference Not Found: "' + r + '"**'
	return library.toMarkdown(ref, verses)
}

function replaceQuotes(text, opts) {
    const pattern = /^\!\(\& ([^\)]+)\)\s*$/gm
    text = text.replace(pattern, (m, r) => blockQuote(r, opts) + os.EOL)
    return text
}

module.exports = textTransformation(replaceQuotes, {refLanguage: 'en'})
