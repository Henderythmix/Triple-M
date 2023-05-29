<a href="https://www.npmjs.com/package/triple-m">
<img src="https://badgen.net/npm/v/triple-m" />
</a>
<img src="https://badgen.net/badge/Typescript/v5.0.4/?icon=typescript&label?" />

# Triple-M

Triple-M (**M**inimal **M**arkup with **M**acros or **MMM**) is a markup language with the goal of simplifying the process of coding an html page by automating certain components like `<meta>` tags and fancy parameters and adding those in on the processing stage

## Usage
to install the package:
```sh
npm install --save-dev triple-m
```
an example on how to compile your webpages would be
```sh
mmmc index.html
```
however, you can learn to use it more fluently by running `mmmc -h` or just `mmmc`

### Syntax
Each line of code should follow more or less this structure

`(spaces)[element] (properties) (;) : (Text)`

- `(spaces)` - The spaces **(NOT INDENTS)** tell the code how many layers into the code you are and how many times to close if you have tag after tag.
- `[element]` - This is the element of what you are closing your code in. (`<element>`)
- `(properties)` - These are the properties of the tag. you can put as many as you want as you were to apply in.
  - `.[class]` transforms into `class="[class]"`
  - `#[id]` transforms into `id="[id]"`
- `;` is an optional tag, that means that you wish to close the element on the same line. 
  - This can also be place as any element before the colon sign and after the element but for intended practices, I suggest as the last component before the colon.
- `:` is currently mandatory as it currently tells the compiler that is all the information for the element, however this will hopefully change in the future
- `(Text)` - Whatever text you wish to put in between.

There are also exception commands, but these are documented in the wiki, or can be seen in the example below.

### Example
Here is an example script:
```
title ; : Website Title
// This is a Comment

// These don't need extensions as it already assumes .js or .css
SCRIPT js/script
CSS css/style

---

nav .navbar :
 a .navbar-brand : Example Page :D

div .container :
 h1 ; : Is there bootstrap installed in this page?
 b : nope! but it's kinda funny I guess lol
```

## Development
to setup the project on your desktop and develop, run these
```sh
git clone https://github.com/Henderythmix/triple-m
cd triple-m
npm install

npm run build # builds the javascript files to run the compiler
npm test # runs the compilation of the example folder
```