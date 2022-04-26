import ast from 'abstract-syntax-tree';

export const findVariable = (html: string, variableName: string) => {
    const parsed = ast.parse(html);
    const variables = ast.find(parsed, 'VariableDeclarator');
    const matchedVariable = variables.find((variable: any) => variable.id.name === variableName);
    if (matchedVariable) {
        const data = ast.generate(matchedVariable?.init);
        return JSON.parse(data);
    }
};
