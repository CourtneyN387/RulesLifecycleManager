
CURRENT_DIR = $(shell pwd)

APP_NAME?=rlm
APP_VERSION?=$(shell cat VERSION)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

export APP_NAME
export APP_VERSION
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY

release: fmt vet lint test
	@echo "Releasing..."
	git tag ${APP_VERSION}
	@git push --tags

fmt:
	@echo "Formatting ..."
	@go fmt ./...

lint:
	@echo "Linting ..."
	@golangci-lint run --timeout=10m

vet:
	@echo "Vetting ..."
	@go vet ./...

test:
	@go test ./... -v -coverprofile bin/cover.out

coverage: test
	@go tool cover -html=bin/cover.out -o bin/cover.html

build:
	@docker-compose build rlm

run: build dynamodb
	@docker-compose up rlm

dynamodb:
	@docker-compose up -d --force-recreate dynamodb
	@docker-compose up -d --force-recreate dynamodb-view
	@aws dynamodb create-table \
		--table-name rain-decision-system-rules-local \
		--attribute-definitions AttributeName=RuleID,AttributeType=S \
		--key-schema AttributeName=RuleID,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 \
		--endpoint-url http://localhost:8000 \
		--region us-east-1
	./testdata/populate-dynamodb.sh

hooks:
ifeq ($(shell which $(CURRENT_DIR)/.git/hooks/pre-commit), )
	@echo "Installing pre-commit git hooks"
	$(shell chmod +x $(CURRENT_DIR)/githooks/pre-commit)
	$(shell ln -s $(CURRENT_DIR)/githooks/pre-commit $(CURRENT_DIR)/.git/hooks/pre-commit)
else
	@echo "Git pre-commit hooks already installed"
endif
