Feature: Serverless Static Website Hosting

  Scenario: Basic website hosting functionality
    Given I have set up a Terraform project with the prefix "cuctest"
    When I have uploaded a file "index.html" to the website content S3 Bucket with the content "abcd"
    And I request "index.html" on the CDN
    Then the response code should be "200"
    And the response content should be "abcd"