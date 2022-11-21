# publishing contract

TARGET?=dev
PROJECT_SLUG="design-a-kit" 

install:
	npm ci

update:
	mkdir -p ./functions/data
	node ./functions/update.js

build:
	mkdir -p ./public/uw
	npm run static
	npm run svg
	npm run build
	node ./functions/ssr.js

deploy:
	./deploy.sh

preprod:
	./deploy.sh --preprod

publish:
	./deploy.sh --production

preview: 
	mkdir -p ./public
	npm run static
	npm run svg
	node functions/ssr.js --preview

uw:
	node functions/ssr.js

clean:
	rm -rf public/
	rm -rf functions/data/