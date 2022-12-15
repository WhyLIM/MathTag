// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let mathTagCounter = 1;

/**
 * 添加数学公式编号
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
        let tagContent = match[1];
    
        // 为数学公式添加编号
        editor.edit(editBuilder => {
            // 计算编号的位置
            let tagNumberStart = tagStart + 2;
            let tagNumberEnd = tagNumberStart;

            // 检查编号是否与公式内容重合
            let tagNumber = `[${mathTagCounter}]`;
            if (tagContent.startsWith(tagNumber)) {
                // 如果编号与公式内容重合，则将编号插入到公式内容的后面
                tagNumberEnd = tagEnd - 2;
            }

            // 插入编号
            editBuilder.insert(new vscode.Position(tagNumberStart, tagNumberEnd), tagNumber);
        });

        // 更新编号
        mathTagCounter += 1;
    }
}

/**
 * 清除数学公式编号
 */
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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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

            // 查找改变的部分是否包含数学公式
            let mathTagRegex = /\$\$([^\$]+)\$\$/g;
            let match;
            while (match = mathTagRegex.exec(text)) {
                let tagStart = match.index + start;
                let tagEnd = tagStart + match[0].length;

                // 检查改变的部分是否包含整个数学公式
                let tagChanged = tagStart >= start && tagEnd <= end;

                // 如果改变的部分包含整个数学公式，就添加或清除编号
                if (tagChanged) {
                    // 检查数学公式之前是否已经有编号
                    let tagNumberRegex = /\[\d+\]/g;
                    let tagNumberMatch = tagNumberRegex.exec(text);
                    if (tagNumberMatch) {
                        // 如果数学公式之前已经有编号，就清除编号
                        clearMathTagNumbers();
                    } else {
                        // 如果数学公式之前没有编号，就添加编号
                        addMathTagNumbers();
                    }
                }
            }
        })
    })
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
