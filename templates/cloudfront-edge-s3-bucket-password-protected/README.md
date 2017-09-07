## Features

 - User-friendly one-button deployment - no manual setup, no `curl | sudo bash`, no "works on my machine"
 - Fully serverless, only pay for the traffic, compute and storage you use
 - Fully encrypted in transit (also CloudFront <> S3, despite many other offerings
 - Users can be managed via a Cognito Userpool in the AWS Console (or via API)
 - S3 Bucket is fully secured via Origin Access Identity. No security through obscurity as proposed in other offerings.

## Known issues

 - Only validated to work in `us-east-1`
 - directory index files have to be named`index.html`, currently hardcoded
 - Currently, there is no redirect for paths without trailing slashes, for example redirecting `/test` to `/test/`, which is e.g. S3 website hosting default behavior.

## How to create users

Create user:
```bash
export COGNITO_USERPOOL=us-east-1_IKVWykVce
export COGNITO_USERPOOL_CLIENT=50uhlu5cd3cd46sj1mjluijofv

export COGNITO_USERNAME=Aladdin
export COGNITO_PASSWORD=Aladdin23$

# create user
aws cognito-idp admin-create-user --user-pool-id $COGNITO_USERPOOL --username $COGNITO_USERNAME --temporary-password 'Something12$'

# change temp password
COGNITO_USER_SESSION=$(aws cognito-idp admin-initiate-auth --user-pool-id $COGNITO_USERPOOL --client-id $COGNITO_USERPOOL_CLIENT --auth-flow  ADMIN_NO_SRP_AUTH --auth-parameters "{\"USERNAME\": \"$COGNITO_USERNAME\", \"PASSWORD\": \"Something12$\"}" --output text --query 'Session')

aws cognito-idp respond-to-auth-challenge --client-id $COGNITO_USERPOOL_CLIENT  --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses "{\"NEW_PASSWORD\": \"$COGNITO_PASSWORD\", \"USERNAME\": \"$COGNITO_USERNAME\"}" --session "$COGNITO_USER_SESSION"
```
