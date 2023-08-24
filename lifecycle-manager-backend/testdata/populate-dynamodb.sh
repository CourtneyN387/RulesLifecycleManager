#! /bin/bash

for filename in testdata/dynamodb/*; do
	echo $filename
	aws dynamodb put-item \
		--table-name rain-decision-system-rules-local \
		--item "file://${filename}" \
		--endpoint-url http://localhost:8000 \
		--region us-east-1
done