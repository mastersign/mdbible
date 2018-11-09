const fs = require('fs')
const _ = require('lodash')
const assert = require('assert')
const mdbible = require('../src/index')

function assertText(actual, expected) {
	const actualLines = actual.match(/[^\r\n]+/g)
	const expectedLines = expected.match(/[^\r\n]+/g)
	assert.deepStrictEqual(actualLines, expectedLines)
}

describe('MdBible', () => {
	it('should replace reference with block quote', () => {
		const result = mdbible.readFileSync('test/data/simple_src.md',
			{sourceEncoding: 'utf8'})
		const expected = fs.readFileSync('test/data/simple_res.md', {encoding: 'utf8'})
		assertText(result, expected)
	})

	describe('for HTML format', () => {
		it('should replace reference with block quote', () => {
			const result = mdbible.readFileSync('test/data/simple_src.md',
				{sourceEncoding: 'utf8', format: 'html'})
			const expected = fs.readFileSync('test/data/simple_res_html.md', {encoding: 'utf8'})
			assertText(result, expected)
		})
	})

	describe('for LaTeX format', () => {
		it('should replace reference with block quote', () => {
			const result = mdbible.readFileSync('test/data/simple_src.md',
				{sourceEncoding: 'utf8', format: 'tex'})
			const expected = fs.readFileSync('test/data/simple_res_tex.md', {encoding: 'utf8'})
			assertText(result, expected)
		})
	})
})
