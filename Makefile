
#
# VARIABLES
#
YARN_CWD = ./
YARN_CMD = yarn
PRETTIER_FILES = . '!node_modules'

# TARGET help: list main entrypoints
.PHONY: help
help:
	@echo "Usage: make TARGET"
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-8s\033[0m %s\n", $$1, $$2}'

############################################
##
## General purpose commands and entry points
##
############################################

fix: node_modules/.yarn-integrity ## [ FIX ] fix all typescript files
	$(YARN_CMD) --cwd $(YARN_CWD) prettier --cache --write $(PRETTIER_FILES)

lint: node_modules/.yarn-integrity ## [ FIX ] lint all typescript files
	$(YARN_CMD) --cwd $(YARN_CWD) prettier --cache --check $(PRETTIER_FILES)
