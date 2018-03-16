
.PHONY: test
test:
	docker build --quiet --target testing --tag legacy-hosts-testing .
	docker run --rm --interactive --volume ${PWD}:/test legacy-hosts-testing


.PHONY: develop
develop:
	docker build --quiet --target develop --tag legacy-hosts-develop .
	docker run -it --publish 8080:8080 legacy-hosts-develop --reload


.PHONY: serve
serve:
	docker build --quiet --tag legacy-hosts .
	docker run -it --publish 8080:8080 legacy-hosts


