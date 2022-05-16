// Copyright © 2022, SAS Institute Inc., Cary, NC, USA. All Rights Reserved.
// Licensed under SAS Code Extension Terms, available at Code_Extension_Agreement.pdf

import { ExtensionContext, Uri } from "vscode";
import { LanguageClientOptions } from "vscode-languageclient";

import { LanguageClient } from "vscode-languageclient/browser";

// this method is called when vs code is activated
export function activate(context: ExtensionContext): void {
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for sas file
    documentSelector: [{ language: "sas" }],
  };

  const client = createWorkerLanguageClient(context, clientOptions);

  context.subscriptions.push(client.start());
}

function createWorkerLanguageClient(
  context: ExtensionContext,
  clientOptions: LanguageClientOptions
) {
  // Create a worker. The worker main file implements the language server.
  const serverMain = Uri.joinPath(
    context.extensionUri,
    "server/dist/browser/server.js"
  );
  const worker = new Worker(serverMain.toString());

  // create the language server client to communicate with the server running in the worker
  return new LanguageClient(
    "sas-lsp",
    "SAS Language Server",
    clientOptions,
    worker
  );
}