.PHONY: serve
serve:
	uv run xlwings-server

.PHONY: serve-dev
serve-dev:
	uv sync
	uv pip install -e ../xlwings-server
	# Separate step: the local xlwings reports version 0.0.0 (stamped on release),
	# which would fail xlwings-server's xlwings>=… pin if resolved together
	uv pip install -e ../xlwings
	uv run --no-sync xlwings-server
