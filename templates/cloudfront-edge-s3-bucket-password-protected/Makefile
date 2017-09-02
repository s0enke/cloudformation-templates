deploy_ansible:
	ansible localhost -m cloudformation -a "stack_name=cfn-edge-n template=template.yaml region=us-east-1"

deploy_aws_cli:
	aws cloudformation deploy --template-file template.yaml --stack-name cfn-edge-n --capabilities CAPABILITY_IAM --region=us-east-1

test_viewer_request_without_authorization:
	AWS_DEFAULT_REGION=us-east-1 aws lambda invoke --function-name cfn-edge-n-CdnViewerRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records": [{"cf":{"request": {"headers": []}}}]}' \
	  outfile | base64 -d
	  cat outfile
	@@rm outfile

test_viewer_request_with_authorization:
	AWS_DEFAULT_REGION=us-east-1 aws lambda invoke --function-name cfn-edge-n-CdnViewerRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records":[{"cf":{"request":{"headers": {"authorization": [{"key": "authorization", "value": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"}]}}}}]}' \
	  outfile | base64 -d
	  cat outfile
	@@rm outfile


test_origin_request_with_authorization:
	AWS_DEFAULT_REGION=us-east-1 aws lambda invoke --function-name cfn-edge-n-CdnOriginRequest --log-type Tail --query LogResult --output text --payload \
	  '{"Records":[{"cf":{"request":{"headers": {"x-authorization-passthrough-from-viewer-request": [{"key": "x-authorization-passthrough-from-viewer-request", "value": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"}]}}}}]}' \
	  outfile | base64 -d
	cat outfile
	@@rm outfile

test_cdn_with_correct_credentials:
	curl -v -u Aladdin:OpenSesame https://d1h2azdn53n2f5.cloudfront.net


test_cdn_with_wrong_credentials:
	curl -v -u Aladdin:WrongPass https://d1h2azdn53n2f5.cloudfront.net