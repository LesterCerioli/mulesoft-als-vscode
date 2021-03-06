'use strict'

import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import { getDocUri, activate } from '../helper';
suite('Should get diagnostics', async function () {

	test('Diagnoses RAML file', async () => {
		await testDiagnostics(getDocUri('missing-title.raml'), [
			{ message: 'API title is mandatory', range: toLspRange(2, 1, 2, 27), severity: vscode.DiagnosticSeverity.Error, source: 'ex' }
		]);
	});

	test('Diagnoses OAS3 file', async () => {
		await testDiagnostics(getDocUri('oas.json'), [
			{ message: "'paths' is mandatory in OAS spec", range: toLspRange(1, 1, 1, 1), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
			{ message: "Info object 'title' must be a single value", range: toLspRange(1, 1, 3, 2), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
			{ message: "Version is mandatory in Info object", range: toLspRange(1, 1, 3, 2), severity: vscode.DiagnosticSeverity.Error, source: 'ex' }
		]);
	});

});

function toLspRange(sLine: number, sChar: number, eLine: number, eChar: number) {
	const start = new vscode.Position(sLine - 1, sChar - 1);
	const end = new vscode.Position(eLine - 1, eChar - 1);
	return new vscode.Range(start, end);
}

async function testDiagnostics(docUri: vscode.Uri, expectedDiagnostics: vscode.Diagnostic[]) {
	await activate(docUri);
	const actualDiagnostics = vscode.languages.getDiagnostics(docUri);
	assert.strictEqual(actualDiagnostics.length, expectedDiagnostics.length);
	expectedDiagnostics.forEach((expectedDiagnostic, i) => {
		const diagnostic = actualDiagnostics.find(e => e.message == expectedDiagnostic.message)
		assert.strictEqual(diagnostic.message, expectedDiagnostic.message);
		assert.deepStrictEqual(diagnostic.range, expectedDiagnostic.range);
		assert.strictEqual(diagnostic.severity, expectedDiagnostic.severity);
	});
}