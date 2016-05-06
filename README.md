# mathpipe
[![Build Status](https://travis-ci.org/physikerwelt/mathpipe.svg?branch=master)](https://travis-ci.org/physikerwelt/mathpipe)
[![Coverage Status](https://coveralls.io/repos/github/physikerwelt/mathpipe/badge.svg?branch=master)](https://coveralls.io/github/physikerwelt/mathpipe?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/physikerwelt/mathpipe/badges/score.svg)](https://www.bithound.io/github/physikerwelt/mathpipe)

Processes tex to png images using different routes

## installation

To install run
```
npm install
```

To use texvc you need to install in addition
```
git submodule init
git submodule update
sudo apt-get install build-essential dvipng ocaml \
  texlive-fonts-recommended texlive-lang-greek texlive-latex-recommended
cd tools/texvc
make
```


## testing

To run the tests run
 ```
 npm test
 ```
 for coverage tests use
 ```
 npm run-script coverage
 ```

## running

To run the program run
```
bin/mathpipe --help
```

## testdata
You can get a [compact test data](http://en.formulasearchengine.com/w/images/math-formula-testcases.json)
or the full english [wikipedia dataset](https://github.com/wikimedia/texvcjs/blob/master/test/en-wiki-formulae.json?raw=true). 

Thereafter run
```
mathpipe convert <path relative to the mathpipe executable> [output directory]
```
For larger dataset it's recommended to adjust the [config](config.yaml).