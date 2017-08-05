import random
import subprocess
import os
import requests
import boto3
import random
import string


project_directory = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))


@given(u'I have set up a Terraform project with the prefix "{app_name}"')
def step_impl(context, app_name):
    path_to_tf = os.path.join(project_directory, 'templates', 'serverless-static-website-hosting')
    subprocess.check_output("terraform init -var app_name=%s %s" % (app_name, path_to_tf), shell=True)
    subprocess.check_output("terraform apply -var app_name=%s %s" % (app_name, path_to_tf), shell=True)

@when(u'I have uploaded a file "{file}" to the website content S3 Bucket with some sample content')
def step_impl(context, file):
    context.file_content = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    storage_bucket_name = subprocess.check_output("terraform output storage_bucket_name", shell=True).decode().strip()
    s3 = boto3.client('s3', region_name='us-east-1')
    s3.put_object(Bucket=storage_bucket_name, Key=file, Body=context.file_content)

@when(u'I request "{file}" on the CDN')
def step_impl(context, file):
    cdn_domain_name = subprocess.check_output("terraform output cdn_domain_name", shell=True).decode().strip()
    url = 'https://%s%s' % (cdn_domain_name, file)
    context.cdn_response = requests.get(url)

@then(u'the response code should be "{code}"')
def step_impl(context, code):
    assert context.cdn_response.status_code is int(code)

@then(u'the response content should be the same')
def step_impl(context):
    assert context.cdn_response.content.decode() == context.file_content

