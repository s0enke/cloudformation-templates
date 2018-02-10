venv:
	virtualenv -p /usr/bin/python3.6 venv

pip:
	pip install -r requirements.txt

test:
	behave features/

deploy_ansible:
	ansible localhost -m cloudformation -a "stack_name=$(STACK_NAME) template=template.yaml region=$(AWS_REGION)"

deploy_aws_cli:
	aws cloudformation deploy --template-file template.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region=$(AWS_REGION)

test_viewer_request_without_authorization:
	AWS_DEFAULT_REGION=$(AWS_REGION) aws lambda invoke --function-name $(STACK_NAME)-CdnViewerRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records": [{"cf":{"request": {"headers": []}}}]}' \
	  outfile | base64 -d
	  cat outfile
	@@rm outfile

test_viewer_request_with_authorization:
	AWS_DEFAULT_REGION=$(AWS_REGION) aws lambda invoke --function-name $(STACK_NAME)-CdnViewerRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records":[{"cf":{"request":{"headers": {"authorization": [{"key": "authorization", "value": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"}]}}}}]}' \
	  outfile | base64 -d
	  cat outfile
	@@rm outfile


test_origin_request_with_authorization:
	AWS_DEFAULT_REGION=$(AWS_REGION) aws lambda invoke --function-name $(STACK_NAME)-CdnOriginRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records":[{"cf":{"request":{"headers": {"x-authorization-passthrough-from-viewer-request": [{"key": "x-authorization-passthrough-from-viewer-request", "value": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"}]}}}}]}' \
	  outfile | base64 -d
	cat outfile
	@@rm outfile

test_cdn_with_correct_credentials:
	curl -v -u 'Aladdin:Aladdin23$$' https://d1h2azdn53n2f5.cloudfront.net/index.html

test_cdn_with_wrong_credentials:
	curl -v -u Aladdin:WrongPass https://d1h2azdn53n2f5.cloudfront.net