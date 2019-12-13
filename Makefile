YARN=yarn
NODE=node
NGROK=ngrok

env=.env

install:
	$(YARN) install

compile:
	$(YARN) run tsc

run: $(env) compile
	set -o allexport && . ./$< && $(NODE) ./src/Run.js

$(env): env.sample
	cp -f $< $@

forward:
	$(NGROK) http 8080
