## Why?

 - CloudFormation is nice because it takes care of state management and has an API. In terms of tool usage I always try to lower the total cost of ownership. Terraform has definetely a higher total cost of ownership.
 - I'd like to have the union set of both tools in terms of resource coverage.
 - Terraform is nice because it supports more resources
 - Why not combine both in order to have the highest feature richness combined with lowest TCO
 - I don't want to reimplement functionality that is already in Terraform or CloudFormation - so I just wrote a couple of lines of glue code.

(TODO: checkout my own TF article for more arguments )

## Features

 - Execute arbitrary Terraform code in CloudFormation
 - Pass parameters from CloudFormation to Terraform
 - Use outputs from Terraform in CloudFormation (e.g. the ID of a created resource).
 - Creation, update and delete is supported
 - Keeps care of Terraform state file handling by providing a private S3 bucket for storage

## Terraform outputs

Terraform outputs are passed 1:1 to CloudFormation so you can use it with the `Fn::GetAtt` method, e.g.

```yaml
  TerraFormCustomResource:
    DependsOn: TerraFormExecuteFunction
    Type: Custom::TerraFormExecute
    Properties:
      Terraform: |
        ... 
        output "SomeOutput" {
          value = "some_value"
        }
```
could be accessed with
```yaml
!GetAtt TerraFormCustomResource.SomeOutput
```
## Known issues

 - [`AWS::Include`](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/create-reusable-transform-function-snippets-and-add-to-your-template-with-aws-include-transform.html) might be used to include the Terraform Lambda function snippet in order to avoid copy and paste