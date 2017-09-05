## How to create users

Create user:
```
aws cognito-idp admin-create-user --user-pool-id us-east-1_wfEHFSnVP --username bernd --temporary-password 'blahblub'
```

Change temporary password:
```
aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_wfEHFSnVP --client-id 2jk6u0qsnvom3lc9cnfn03a9v3 --auth-flow  ADMIN_NO_SRP_AUTH --auth-parameters '{"USERNAME": "bernd", "PASSWORD": "blahblub"}'
```


```
aws cognito-idp respond-to-auth-challenge --client-id 2jk6u0qsnvom3lc9cnfn03a9v3  --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses '{"NEW_PASSWORD":"blahblub23", "USERNAME": "bernd"}' --session '<SESSION>'
```
