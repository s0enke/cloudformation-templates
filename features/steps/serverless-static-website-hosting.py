from subprocess import call
import os

project_directory = os.path.realpath(os.path.join(os.path.dirname(__file__), '../..'))


@given(u'I have set up a Terraform project with the prefix "{app_name}"')
def step_impl(context, app_name):
    path_to_tf = os.path.join(project_directory, 'templates', 'serverless-protected-website-hosting')
    call("terraform init -var app_name=%s %s" % (app_name, path_to_tf), shell=True)
    call("terraform apply -var app_name=%s %s" % (app_name, path_to_tf), shell=True)
    return True

@given(u'I have uploaded a file "index.html" to the website content S3 Bucket with the content "asfd"')
def step_impl(context):
    raise NotImplementedError(u'STEP: Given I have uploaded a file "index.html" to the website content S3 Bucket with the content "asfd"')

@when(u'I request <CDN URL>/index.html')
def step_impl(context):
    raise NotImplementedError(u'STEP: When I request <CDN URL>/index.html')

@then(u'the response code should be 200 OK')
def step_impl(context):
    raise NotImplementedError(u'STEP: Then the response code should be 200 OK')

@then(u'the response content should be "asdf"')
def step_impl(context):
    raise NotImplementedError(u'STEP: Then the response content should be "asdf"')
