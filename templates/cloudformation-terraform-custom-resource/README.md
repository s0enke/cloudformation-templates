## Why?

 - CloudFormation is nice because it manages state and has an API
 - Terraform is nice because it supports more resources
 - Why not combine both in order to have the highest feature richness combined with lowest TCO
 - I don't want to reimplement functionality that is already in Terraform or CloudFormation - so I just wrote a couple of lines of glue code.

(TODO: checkout my own TF article for more arguments )

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