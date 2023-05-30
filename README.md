<a href="https://www.npmjs.com/package/triple-m"><img src="https://badgen.net/npm/v/triple-m" /></a>
<img src="https://badgen.net/packagephobia/install/triple-m" />

# Triple-M

Triple-M (**M**inimal **M**arkup with **M**acros or **MMM**) is a markup language with the goal of simplifying the process of coding an html page by automating certain components like `<meta>` tags and fancy parameters and adding those in on the processing stage

## Usage
To install the package:
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
```mmm
title ; : Website Title
// This is a Comment

// You do not need quotation marks when referring to a file
SCRIPT js/script.js
// You can even hard embed scripts directly into the html page with EMBED
CSS css/style.css EMBED

// the line below indicates that you are splitting between the head and body tags
// If the line is there, then it will not create a full html file.
---

nav .navbar :
 a .navbar-brand : Example Page :D

div .container :
 h1 ; : Is there bootstrap installed in this page?
 b : nope! but it's kinda funny I guess lol
```
For more documentation, you can go to the [wiki](https://github.com/Henderythmix/Triple-M/wiki)

## Development
to setup the project on your desktop and develop, run these
```sh
git clone https://github.com/Henderythmix/triple-m
cd triple-m
npm install

npm run build # builds the javascript files to run the compiler
npm test # runs the compilation of the example folder
```