NPM=npm
NODE=node
NGROK=ngrok
HEROKU=heroku

env=.env
heroku_app_name=

install:
	$(NPM) install

compile:
	$(NPM) run tsc

run: $(env) compile
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
