test:
	@./node_modules/.bin/mocha \
		--recursive
	@./node_modules/.bin/mocha \
		--require blanket \
		--recursive \
		--reporter mocha-cov-reporter

.PHONY: test
