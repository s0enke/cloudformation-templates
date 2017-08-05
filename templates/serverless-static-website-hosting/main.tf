# https://read.acloud.guru/supercharging-a-static-site-with-lambda-edge-da5a1314238b

variable "app_name" {
  default = "static-website"
}
variable "profile" {
  default = "default"
}
provider "aws" {
  region = "us-east-1"
  profile = "${var.profile}"
}

resource "aws_lambda_function" "origin_request" {
  function_name = "${var.app_name}-origin-request"
  filename = "${data.archive_file.origin_request.output_path}"
  source_code_hash = "${data.archive_file.origin_request.output_base64sha256}"
  role = "${aws_iam_role.main.arn}"
  runtime = "nodejs6.10"
  handler = "index.handler"
  memory_size = 128
  timeout = 1
  publish = true
}
data "archive_file" "origin_request" {
  type = "zip"
  output_path = "${path.module}/.zip/origin_request.zip"
  source {
    filename = "index.js"
    content = "${file("${path.module}/functions/origin_request.js")}"
  }
}

data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}
resource "aws_iam_role" "main" {
  name_prefix = "${var.app_name}"
  assume_role_policy = "${data.aws_iam_policy_document.lambda.json}"

}

resource "aws_iam_policy_attachment" "lambda_function_policy" {
  name       = "lambda-basic-execution"
  roles      = ["${aws_iam_role.main.name}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_s3_bucket" "main" {
  bucket_prefix = "${var.app_name}"
  acl = "private"
  force_destroy = true
  acceleration_status = "Enabled"
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Created for ${var.app_name}"
}

data "aws_iam_policy_document" "s3" {
  statement {
    actions = [
      "s3:ListBucket",
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.main.arn}",
      "${aws_s3_bucket.main.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = ["${aws_cloudfront_origin_access_identity.main.iam_arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "main" {
  bucket = "${aws_s3_bucket.main.id}"
  policy = "${data.aws_iam_policy_document.s3.json}"
}

resource "aws_cloudfront_distribution" "main" {
  enabled = true
  http_version = "http2"
  price_class = "PriceClass_100"
  is_ipv6_enabled = true
  origin {
    origin_id = "s3-origin"
    domain_name = "${aws_s3_bucket.main.bucket_domain_name}"
    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path}"
    }
  }
  default_cache_behavior {
    target_origin_id = "s3-origin"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    min_ttl = 0
    default_ttl = 0
    max_ttl = 0
    compress = true
    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = "${aws_lambda_function.origin_request.qualified_arn}"
    }
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

output "storage_bucket_name" {
  value = "${aws_s3_bucket.main.bucket}"
}

output "cdn_domain_name" {
  value = "${aws_cloudfront_distribution.main.domain_name}"
}