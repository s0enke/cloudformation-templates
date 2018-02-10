import subprocess
import os
import requests
import boto3
import random
import string


cfn_client = boto3.client('cloudformation')

response = cfn_client.describe_stacks(StackName=os.environ['STACK_NAME'])
cfn_stackoutputs_raw = response['Stacks'][0]['Outputs']
cfn_stackoutputs = {raw_cfn_output['OutputKey']: raw_cfn_output['OutputValue'] for raw_cfn_output in cfn_stackoutputs_raw}

project_directory = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))

@when(u'I have uploaded a file "{file}" to the website content S3 Bucket with some sample content')
def step_impl(context, file):
    context.file_content = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    s3 = boto3.client('s3', region_name='us-east-1')
    s3.put_object(Bucket=cfn_stackoutputs['S3Bucket'], Key=file, Body=context.file_content)

@when(u'I request "{file}" on the CDN with correct credentials')
def step_impl(context, file):
    url = 'https://%s%s' % (cfn_stackoutputs['CdnDomain'], file)
    context.cdn_response = requests.get(url, auth=('Aladdin', 'Aladdin23$'))

@then(u'the response code should be "{code}"')
def step_impl(context, code):
    assert context.cdn_response.status_code is int(code)

@then(u'the response content should be the same')
def step_impl(context):
    assert context.cdn_response.content.decode() == context.file_content

