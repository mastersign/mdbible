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

function strCase(source, expected, opt) {
	const result = mdbible(source, opt)
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
			strCase(
				'ABC (& Gen 1:1) XYZ',
				'ABC Gen 1:1 XYZ',
				{})
		})

		it('should replace reference with block quote', () => {
			fileCase('single-wt', 'md')
		})
	})
	describe('without explicit but changed default translation', () => {
		it('should format inline reference with original book name by option', () => {
			strCase(
				'ABC (& Gen 1:1) XYZ',
				'ABC 1. Mo 1:1 XYZ',
				{defaultTranslation: 'LUT1912', useOriginalBookName: true, translateBookName: false})
		})
		it('should format inline reference with original and translated book name', () => {
			strCase(
				'ABC (& Gen 1:1) XYZ',
				'ABC 1. Mo (Gen) 1:1 XYZ',
				{defaultTranslation: 'LUT1912', useOriginalBookName: true, translateBookName: true})
		})
		it('should format inline reference with translated book name', () => {
			strCase(
				'ABC (& Gen 1:1) XYZ',
				'ABC Gen 1:1 XYZ',
				{defaultTranslation: 'LUT1912', useOriginalBookName: false, translateBookName: false})
		})
		it('should format inline reference with translated and original book name', () => {
			strCase(
				'ABC (& Gen 1:1) XYZ',
				'ABC Gen (1. Mo) 1:1 XYZ',
				{defaultTranslation: 'LUT1912', useOriginalBookName: false, translateBookName: true})
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
