YARN=yarn
NODE=node

install:
	$(YARN) install

compile:
	$(YARN) run tsc

run: compile
	$(NODE) ./src/Run.js

