import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('open-url-in-browser.open', () => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return;
			}

			if (editor.document.isUntitled) {
				vscode.window.showErrorMessage(`File must be saved to open the URL.`);
				return;
			}

			const resource = editor.document.uri;

			if (!vscode.workspace.getWorkspaceFolder(resource)) {
				vscode.window.showErrorMessage(`File must be located within the currently-open workspace.`);
				return;
			}

			const config = vscode.workspace.getConfiguration('mappings', resource);

			if (!config) {
				vscode.window.showErrorMessage(`Incorrect configuration.`);
				return;
			}

			const localRoot = config.get('localRoot');
			const serverRoot = config.get('serverRoot');

			const serverUrl = resource.fsPath.replace(localRoot as string, serverRoot as string).replaceAll('\\', '/');

			try {
				vscode.env.openExternal(vscode.Uri.parse(serverUrl));
			} catch (error) {
				vscode.window.showErrorMessage(`${serverUrl}: Invalid URL.`);
				return;
			}
		})
	);
}

export function deactivate() {}
