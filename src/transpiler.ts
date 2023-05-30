import * as fs from 'fs'; 

export namespace MMM {
    export interface TranspileResponse {
        output: string;
        Log?: Array<string>;
        Other?: any;
    }

    export interface Macro {
        key: string,
        output: (args: string[]) => TranspileResponse
    }

    var CreatedMacros: Array<Macro> = [];

    export function CreateMacro(k: string, o: (args: string[]) => TranspileResponse) {
        CreatedMacros.push({key: k, output: o});
    }

    // The most important function to the transpiler
    // Please do not break :)
    export function TranspileLine(line: string, lineno?: number): TranspileResponse {
        let keys = line.split(" ");
        //console.log(keys);
        
        let tag = keys[0];
        let prefix: string = "";
        let suffix: string = "";
        let content: string = "";
        let classes: string = "";
        let ids: string = "";
        let indents: number = 0;
        let ReadingStage: number = 0;
        let Open: boolean = true
        
        // Look at the first key to determine what to do with the line
        
        // Processing the rest of the keys
        for (let j: number = 0; j < keys.length; j++) {
            if (ReadingStage == 0) {
                if (keys[0][0] == "/" && keys[0][1] == "/") return {output: ''};
                if (keys[j] == '') {
                    indents++;
                    continue
                }

                for (let i = 0; i < CreatedMacros.length; i++) {
                    if (keys[j] == CreatedMacros[i].key) return CreatedMacros[i].output(keys.slice(indents));
                }

                // Check if there is a prebuilt Block for this key

                prefix += "<" + keys[j];
                tag = keys[j];
                ReadingStage = 1;

            } else if (ReadingStage == 1) {
                
                // Close the tags in one line
                if (keys[j] == ";") {
                    suffix = `</${tag}>`;
                    Open = false;
                    continue
                }

                // Appending a Class
                if (keys[j][0] == ".") {
                    classes += keys[j].replace(".", '') + ' '
                    continue;
                }

                // Appending an ID
                if (keys[j][0] == "#") {
                    ids += keys[j].replace("#", '') + ' '
                    continue;
                }

                // Appending Text
                if (keys[j] == ":") {
                    prefix += `${classes != "" ? ` class="${classes.substring(0, classes.length-1)}"` : ""}${ids != "" ? ` id="${ids.substring(0, ids.length-1)}"` : ""}>`;
                    ReadingStage = 2;
                    continue
                }
                
                // Otherwise
                prefix += " "+keys[j];
            } else {
                if (j == keys.length-1) {
                    content += keys[j];
                    continue;
                }
                content += keys[j] + " ";
            }
        }
        
        // now the return. Lets report explicit cases first
        if (ReadingStage == 1 ) return {output: "", Log: [`${lineno != null ? `Line ${lineno+1} - ` : ""}Missing ":" divider`]}
        if (tag == "") return {output: ""}

        return {output: `${prefix}${content}${suffix}\n`, Other: {
            Indents: indents, tag: tag, OpenElement: Open
        }};
    }

    export function TranspileFull(code : string) : TranspileResponse {
        let lines: Array<string> = code.split(/\r?\n/);;
        let output: string = "";
        let prefix: string = "";
        let suffix: string = "";

        let CompilerProcess = {
            indentLevel: 0,
            DivStack: <Array<string>>[]
        }

        var LogsTotal: string[] = []

        // now look at each line, and process it as needed
        for (let i: number = 0; i < lines.length; i++) {
            if (lines[i] == "---") {
                output += "</head><body>";
                prefix = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />`;
                suffix = "</body></html>";
                continue
            }

            let res = TranspileLine(lines[i], i)
            if (res.Log) {
                LogsTotal.push(res.Log[0])
                continue
            }

            if (CompilerProcess.indentLevel > res.Other?.Indents) {
                for (let j = CompilerProcess.indentLevel; j > res.Other.Indents; j--) {
                    output += `</${CompilerProcess.DivStack.pop()}>`
                    CompilerProcess.indentLevel--;
                }
            }
            
            if (res.Other?.OpenElement) {
                CompilerProcess.indentLevel++;
                CompilerProcess.DivStack.push(res.Other?.tag);
            }

            output += res.output;
        }

        // one last check
        if (CompilerProcess.indentLevel > 0) {
            for (let j = 0; j < CompilerProcess.indentLevel; j++) {
                output += `</${CompilerProcess.DivStack.pop()}>`
            }
        }
        
        let response: TranspileResponse = {
            output: prefix + output + suffix,
            Log: LogsTotal
        }

        return response;
    }
}

// Creation of Basic Required Chunks
MMM.CreateMacro("JS", (args: string[]) => {
    if (args[2] == "EMBED") {
        let script: string = fs.readFileSync(args[1], {encoding: "utf-8"});
        return {output: `<script type="text/javascript"/>${script}</script>`};
    }
    return {output: `<script src="${args[1]}" type="text/javascript"></script>\n`}
});

MMM.CreateMacro("CSS", (args: string[]) => {
    if (args[2] == "EMBED") {
        let script: string = fs.readFileSync(args[1], {encoding: "utf-8"});
        return {output: `<style>${script}</style>`};
    }
    return {output: `<link rel="stylesheet" type="text/css" href="${args[1]}" />\n`}
});

// MMM.CreateMacro("INPUT", (args: string[]) => {
//     let classes: string = "";
//     let ids: string = "";
//     return {output: `<input />`}
// });