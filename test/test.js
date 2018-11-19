/** globals describe, it, before */
/* jshint trailingcomma: false */

const assert = require('assert')
const fs = require('fs')
const _ = require('lodash')
const mdbible = require('../src/index')

function assertText(actual, expected) {
	const actualLines = actual.match(/[^\r\n]+/g)
	const expectedLines = expected.match(/[^\r\n]+/g)
	assert.deepStrictEqual(actualLines, expectedLines, 'Actual result text does not match expected result.')
}

function fileCase(name, format, opt) {
	const mergedOpt = _.defaults({sourceEncoding: 'utf8',}, opt)
	const result = mdbible.readFileSync(`test/data/${name}_src.md`, mergedOpt)
	const expected = fs.readFileSync(`test/data/${name}_res_${format}.md`, {encoding: 'utf-8'})
	assertText(result, expected)
}

describe('MdBible', () => {
	it('should replace inline reference with formatted reference', () => {
		fileCase('inlineref', 'md')
	})

	it('should replace reference with block quote', () => {
		fileCase('single', 'md')
	})

	it('should replace multi references with block quotes', () => {
		fileCase('multi', 'md')
	})

	describe('without explicit translation', () => {
		it('should replace inline reference with formatted reference', () => {
			fileCase('inlineref-wt', 'md')
		})

		it('should replace reference with block quote', () => {
			fileCase('single-wt', 'md')
		})
	})
	describe('without explicit but changed default translation', () => {
		it('should replace inline reference with formatted reference', () => {
			fileCase('inlineref-wt-dl', 'md', {defaultTranslation: 'LUT1912'})
		})

		it('should replace reference with block quote', () => {
			fileCase('single-wt-dl', 'md', {defaultTranslation: 'LUT1912'})
		})
	})

	describe('for HTML format', () => {
		it('should replace reference with block quote', () => {
			fileCase('single', 'html', {format: 'html'})
		})
	})

	describe('for LaTeX format', () => {
		it('should replace reference with block quote', () => {
			fileCase('single', 'tex', {format: 'tex'})
		})
	})
})
