// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let mathTagCounter = 1;

/**
 * @param {vscode.ExtensionContext} context
 */

function addMathTagNumbers() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // 查找数学公式的位置
    let text = editor.document.getText();
    let mathTagRegex = /\$\$([^\$]+)\$\$/g;
    let match;
    while (match = mathTagRegex.exec(text)) {
        let tagStart = match.index;
        let tagEnd = tagStart + match[0].length;
    
        // 为数学公式添加编号
        editor.edit(editBuilder => {
            // 计算编号的位置
            let tagNumberStart = tagStart + 2;
            let tagNumberEnd = tagNumberStart;
    
            // 插入编号
            let tagNumber = `[${mathTagCounter}]`;
            editBuilder.insert(new vscode.Position(tagNumberStart, tagNumberEnd), tagNumber);
        });
    
        // 更新编号
        mathTagCounter += 1;
    }
}   

function clearMathTagNumbers() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // 查找数学公式的位置
    let text = editor.document.getText();
    let mathTagRegex = /\$\$([^\$]+)\$\$/g;
    let match;
    while (match = mathTagRegex.exec(text)) {
        let tagStart = match.index;
        let tagEnd = tagStart + match[0].length;

        // 删除编号
        editor.edit(editBuilder => {
            let tagNumberStart = tagStart + 2;
            let tagNumberEnd = tagNumberStart + 3;
            editBuilder.delete(new vscode.Range(tagNumberStart, tagNumberEnd));
        });
    }

    // 重置编号计数器
    mathTagCounter = 1;
}

function activate(context) {
    // 注册添加数学公式编号的命令
    context.subscriptions.push(vscode.commands.registerCommand('mathTag.addMathTagNumbers', addMathTagNumbers));
    // 注册清除数学公式编号的快捷键命令
    context.subscriptions.push(vscode.commands.registerCommand('mathTag.clearMathTagNumbers', clearMathTagNumbers));

    // 注册文档更改监听器
    vscode.workspace.onDidChangeTextDocument(event => {
        event.contentChanges.forEach(change => {
            // 遍历每一个文档范围
            let start = change.rangeOffset;
            let end = start + change.rangeLength;
            let text = change.text;

            // 查找数学公式的位置
            let mathTagRegex = /\$\$([^\$]+)\$\$/g;
            let match;
            while (match = mathTagRegex.exec(text)) {
                let tagStart = start + match.index;
                let tagEnd = tagStart + match[0].length;

                // 为数学公式添加编号
                let editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }

                // 计算编号的位置
                let tagNumberStart = tagStart + 2;
                let tagNumberEnd = tagNumberStart;

                // 插入编号
                editor.edit(editBuilder => {
                    let tagNumber = `[${mathTagCounter}]`;
                    editBuilder.insert(new vscode.Position(tagNumberStart, tagNumberEnd), tagNumber);
                });

                // 更新编号
                mathTagCounter += 1;
            }
        });
    });
}

// This method is called when your extension is deactivated
function deactivate() {
    // 清理监听器
    vscode.workspace.onDidChangeTextDocument(null);
}

module.exports = {
	activate,
	deactivate
}
