Feature: Serverless Static Website Hosting

  Scenario Outline: Basic website hosting functionality
    When I have uploaded a file "<uploaded file>" to the website content S3 Bucket with some sample content
    And I request "<requested path>" on the CDN with correct credentials
    Then the response code should be "200"
    And the response content should be the same
    Examples:
    | uploaded file       | requested path    |
    | index.html          | /index.html       |
    | index.html          | /                 |
    | first/index.html    | /first/index.html |
    | first/index.html    | /first/           |
    | first/index.html    | /first            |