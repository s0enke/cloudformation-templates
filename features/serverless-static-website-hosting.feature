Feature: Serverless Static Website Hosting

  Scenario Outline: Basic website hosting functionality
    Given I have set up a Terraform project with the prefix "cuctest"
    When I have uploaded a file "<uploaded file>" to the website content S3 Bucket with some sample content
    And I request "<requested path>" on the CDN
    Then the response code should be "<response code>"
    And the response content should be the same

    Examples:
    | uploaded file | requested path | response code |
    | index.html    | /index.html    | 200           |
    | index.html    | /              | 200           |