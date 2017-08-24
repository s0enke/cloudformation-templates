deploy:
	ansible localhost -m cloudformation -a "stack_name=cfn-edge-n template=template.yaml region=us-east-1"

deploy_new:
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
