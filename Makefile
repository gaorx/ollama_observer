

.PHONY: build
build:
	@go build -o dist/ollamao


.PHONY: clean
clean:
	@rm -rf dist


.PHONY: cloc
cloc:
	@cloc . --exclude-dir=dist,.git,.idea,.vscode