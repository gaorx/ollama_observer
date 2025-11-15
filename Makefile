

.PHONY: build
build:
	@bun run build && go build -o dist/ollamao


.PHONY: clean
clean:
	@rm -rf dist && rm -rf ui/dist


.PHONY: cloc
cloc:
	@cloc . --exclude-dir=dist,.git,.idea,.vscode
