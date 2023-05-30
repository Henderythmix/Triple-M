import * as fs from 'fs'; 
import * as path from 'path';
import { MMM } from './transpiler';
import { argv, exit } from 'process';

console.log(process.cwd() + "\\chunks.js")

try {
    const CreateChunks = require(process.cwd() + "\\chunks.js");
    CreateChunks();
} catch (err: any) {
    //console.log(err)
    if (err.code == 'MODULE_NOT_FOUND') {
        console.warn("WARNING: You do not have a chunks.js file. You can add one to add custom chunks to the project to expand on the language's possibilities.")
    } else {
        console.error("Error in templates file:\n", err.message)
        exit();
    }
}

const man: string = `
${'\x1b[32m\x1b[1m'}  Triple-M - The Minimal Macro Markup Compiler${'\x1b[0m'}
 USAGE: mmmc [File] [Output]
    OR: mmmc -[b]
------------------------------------------------
-b | Builds all .mmm files
`

function CompileFile(f: string, o?: string) {
    console.log("Compiling " + f);
    let file: string = fs.readFileSync(f, {encoding: "utf-8"});
    let output: MMM.TranspileResponse = MMM.TranspileFull(file);

    if (output.Log?.length != 0) {
        console.log(output.Log)
    } else {
        console.log("Compile Successful!");
        fs.writeFileSync(o ? o : "index.html", output.output);
    }
}

const findFileByExt = (folderPath: string, ext: string): string[] => {
    var files = fs.readdirSync(folderPath);
    var result: any[] = [];
    
    files.forEach( 
        function (file) {
            var newbase = path.join(folderPath, file);
            if ( fs.statSync(newbase).isDirectory() ){
                result = result.concat(findFileByExt(newbase,ext))
                //result = findFileByExt(newbase,ext,fs.readdirSync(newbase),result);
            } else             {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext ){
                    result.push(newbase);
                } 
            }
        }
    )

    return result;
}

// The actual execution
if (process.argv.length == 2) {
    console.log(man);
} else if (process.argv.length == 3) {
    if (process.argv[2][0] == "-") {
        let ResponseMode = 0
        for (let i=1; i < process.argv[2].length; i++) {
            switch (process.argv[2][i]) {
                case "b":
                    console.log("Building all Files");
            }

        }

        switch (ResponseMode) {
            case 0:
                let files = findFileByExt(process.cwd(), "mmm");
                files.forEach((file) => {
                    //console.log(file.split('.'));
                    CompileFile(file, `${file.split('.')[0]}.html`);
                })
        }
    } else {
        CompileFile(process.argv[2]);
    }
} else if (process.argv.length == 4) {
    CompileFile(process.argv[2], process.argv[3])
}