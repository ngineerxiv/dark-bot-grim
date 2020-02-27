NPM=npm
NODE=node
NGROK=ngrok
HEROKU=heroku
DOCKER=docker

env=.env
heroku_app_name=

.PHONY: redis

install:
	$(NPM) install

compile:
	$(NPM) run tsc

run: $(env) compile
	set -o allexport && . ./$< && $(NODE) ./src/Run.js

redis:
	$(DOCKER) run -ti -p 6379:6379 -v $(PWD)/redis:/data redis:5.0.7 

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
	$(HEROKU) addons:create heroku-redis:hobby-dev

$(HEROKU):
	which $@ || echo 'please install heroku cli https://devcenter.heroku.com/articles/heroku-cli'
