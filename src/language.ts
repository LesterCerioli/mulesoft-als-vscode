import * as vscode from 'vscode'
import { DocumentFormattingParams, DocumentFormattingRequest, DocumentRangeFormattingParams, DocumentRangeFormattingRequest } from 'vscode-languageclient'
import { LanguageClient } from 'vscode-languageclient/node'

const defaultFormattingOptions = {
    tabSize: 2,
    insertSpaces: true
}

export const LANGUAGE_ID : string = "raml"

export class FormattingProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
  languageClient: LanguageClient
  constructor(languageClient: LanguageClient) {
    this.languageClient = languageClient
  }
  provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    if(!options){
      options = defaultFormattingOptions
    }

    const params : DocumentRangeFormattingParams = {
      textDocument : this.languageClient.code2ProtocolConverter.asTextDocumentIdentifier(document),
      range : this.languageClient.code2ProtocolConverter.asRange(range),
      options : this.languageClient.code2ProtocolConverter.asFormattingOptions(options, {})
    }

    return this.languageClient.sendRequest(DocumentRangeFormattingRequest.type, params)
      .then(result => {
        return result && this.languageClient.protocol2CodeConverter.asTextEdits(result)
      })
  }
  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    if(!options){
      options = defaultFormattingOptions
    }

    var params : DocumentFormattingParams = {
      textDocument: this.languageClient.code2ProtocolConverter.asTextDocumentIdentifier(document),
      options: this.languageClient.code2ProtocolConverter.asFormattingOptions(options, {})
    }
    // ProtocolRequestType<DocumentFormattingParams, TextEdit[] | null, never, void, DocumentFormattingRegistrationOptions>;
    return this.languageClient.sendRequest(DocumentFormattingRequest.type, params)
    .then(result => {
      return result && this.languageClient.protocol2CodeConverter.asTextEdits(result)
    })
  }


}
