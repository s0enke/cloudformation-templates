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
  participant "Deploy Backend step" as DeployBackendStep;
  participant "Serverless framework";
  participant "DeployFrontendStep";
  participant "NpmInstall";
  participant "WebsiteBucket";
  GitHub -> CodePipeline: triggers run;
  CodePipeline -> SourceStep: invokes;
  SourceStep -> CodePipeline: sends back artifact;
  @enduml
)
