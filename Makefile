NPM=npm
NODE=node
NGROK=ngrok
HEROKU=heroku
DOCKER=docker

env=.env
heroku_app_name=

install:
	$(NPM) install

compile:
	$(NPM) run tsc

dist:
	$(NPM) run dist

dist/tar:
	tar cvfz dist.tar.gz dist

run/dist:
	set -o allexport && . ./$(env) && $(NODE) ./dist/Run.js

run: $(env) compile
	set -o allexport && . ./$< && $(NODE) ./src/Run.js

esbuild:
	$(NPM) run esbuild

run/esbuild: $(env) esbuild
	set -o allexport && . ./$< && $(NODE) ./src/Run.js

$(env): env.sample
	cp -f $< $@

forward:
	$(NGROK) http 8080

deploy/heroku:
	git push heroku master

deploy/heroku/env: $(HEROKU)
	$(HEROKU) config:push --app $(heroku_app_name) --file $(env)

deploy/heroku/setup: $(HEROKU)
	$(HEROKU) plugins:install heroku-config

$(HEROKU):
	which $@ || echo 'please install heroku cli https://devcenter.heroku.com/articles/heroku-cli'
