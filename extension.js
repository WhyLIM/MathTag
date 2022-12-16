const vscode = require('vscode');

function addNumbers() {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // 获取当前编辑器的文档
    const document = editor.document;
    const text = document.getText();

    // 使用正则表达式匹配数学公式
    const mathFormulas = text.match(/\$\$[^\$]+\$\$/g);

    if (!mathFormulas) {
        return;
    }

    // 为每个数学公式添加编号
    for (let i = 0; i < mathFormulas.length; i++) {
        const mathFormula = mathFormulas[i];
        const newMathFormula = `${mathFormula} {#${i}}`;
        text = text.replace(mathFormula, newMathFormula);
    }

    // 使用编辑器的 edit 方法修改文本
    editor.edit(editBuilder => {
        editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), text);
    });
}

function removeNumbers() {
    // 获取当前活动的编辑器
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // 获取当前编辑器的文档
    const document = editor.document;
    const text = document.getText();

    // 使用正则表达式匹配数学公式，并将带有编号的数学公式替换为不带编号的数学公式
    const mathFormulasWithNumbers = text.match(/$$[^$]+{#[^}]+}$$/g);

    if (!mathFormulasWithNumbers) {
        return;
    }

    // 删除每个数学公式的编号
    for (let i = 0; i < mathFormulasWithNumbers.length; i++) {
        const mathFormulaWithNumber = mathFormulasWithNumbers[i];
        const mathFormula = mathFormulaWithNumber.replace(/{#[^}]+}/, '');
        text = text.replace(mathFormulaWithNumber, mathFormula);
    }

    // 使用编辑器的 edit 方法修改文本
    editor.edit(editBuilder => {
        editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), text);
    });
}

module.exports = {
    addNumbers,
    removeNumbers
};
