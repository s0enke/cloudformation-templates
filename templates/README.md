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

#### DeployBackend step

![](http://g.gravizo.com/g?
  @startuml;
  actor "CodePipeline";
  participant "Deploy Backend step" as DeployBackendStep;
  participant "Serverless framework" as ServerlessFramework;
  participant "CloudFormation stack" as CloudFormationStack;
  participant "CloudFormation output" as CloudFormationOutput;
  CodePipeline -> DeployBackendStep: invokes;
  DeployBackendStep -> ServerlessFramework: "calls 'serverless deploy'";
  ServerlessFramework -> CloudFormationStack: creates resources;
  CloudFormationStack -> CloudFormationOutput: outputs e.g. service endpoint;
  CloudFormationOutput -> DeployBackendStep: pack as output artifact;
  DeployBackendStep -> CodePipeline: return sucessful;
  @enduml
)
