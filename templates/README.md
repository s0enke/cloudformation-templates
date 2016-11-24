## Serverless pipeline

![](http://g.gravizo.com/g?
  @startuml;
  actor User;
  participant "CloudFormation";
  participant "CodePipeline";
  User -> CloudFormation: creates Stack;
  activate CloudFormation;
  CloudFormation -> CodePipeline: creates;
  activate CodePipeline;
  deactivate CodePipeline;
  deactivate CloudFormation;
  @enduml
)
