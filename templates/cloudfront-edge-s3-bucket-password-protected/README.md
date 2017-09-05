## Known issues

 - Only validated to work in `us-east-1`

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
