## Why?

 - CloudFormation is nice because it manages state and has an API
 - Terraform is nice because it supports more resources
 - Why not combine both in order to have the highest feature richness combined with lowest TCO

(TODO: checkout my own TF article for more arguments )

## Terraform outputs

TBD

## Known issues

 - [`AWS::Include`](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/create-reusable-transform-function-snippets-and-add-to-your-template-with-aws-include-transform.html) might be used to include the Terraform Lambda function snippet in order to avoid copy and paste