REPORTER = dot

test:
  @NODE_ENV=test /usr/local/bin/mocha \
    --reporter $(REPORTER) \

test-w:
  @NODE_ENV=test /usr/local/bin/mocha \
    --reporter $(REPORTER) \
    --growl \
    --watch

.PHONY: test test-w
