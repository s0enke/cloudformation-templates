## Serverless pipeline

### How the stack is created

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

### How the pipeline works

![](http://g.gravizo.com/g?
  @startuml;
  actor GitHub;
  participant "CodePipeline";
  participant "SourceStep";
  participant "InfrastructureStep";
  participant "InfrastructureStack";
  participant "WebsiteBucket";
  GitHub -> CodePipeline: triggers run;
  CodePipeline -> SourceStep: invokes;
  SourceStep -> CodePipeline: sends back artifact;
  CodePipeline -> InfrastructureStep: invokes;
  InfrastructureStep -> InfrastructureStack: creates from infrastructure.yml;
  @enduml
)
