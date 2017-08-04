Feature: Serverless Static Website Hosting

  Scenario: Basic website hosting functionality
    Given I have set up a Terraform project with the prefix "cuc-test"
    And I have uploaded a file "index.html" to the website content S3 Bucket with the content "asfd"
    When I request <CDN URL>/index.html
    Then the response code should be 200 OK
    And the response content should be "asdf"