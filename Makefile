
.PHONY: test
test:
	docker build --quiet --target testing --tag legacy-hosts-testing .
	docker run --rm --interactive --volume ${PWD}:/test legacy-hosts-testing


.PHONY: develop
develop:
	docker build --quiet --target develop --tag legacy-hosts-develop .
	docker run -it --volume ${PWD}/src:/legacy_hosts/src --entrypoint pip legacy-hosts-develop install --quiet -e /legacy_hosts
	docker run -it --publish 8080:8080 --volume ${PWD}/content:/content --volume ${PWD}/src:/legacy_hosts/src legacy-hosts-develop --reload


.PHONY: serve
serve:
	docker build --quiet --tag legacy-hosts .
	docker run -it --publish 8080:8080 legacy-hosts


