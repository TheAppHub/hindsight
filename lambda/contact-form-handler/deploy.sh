#!/bin/bash

# Contact Form Lambda Function Deployment Script
# This script deploys the Lambda function and API Gateway using AWS CLI

set -e

# Configuration
STACK_NAME="contact-form-handler"
REGION="us-east-1"  # Change this to your preferred region
FROM_EMAIL="noreply@yourdomain.com"  # Change this to your verified SES email
TO_EMAIL="contact@hindsight.com.au"  # Change this to your contact email
ENVIRONMENT="production"

echo "🚀 Deploying Contact Form Handler Lambda Function..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
cd "$(dirname "$0")"

# Install dependencies
echo "📥 Installing dependencies..."
npm install --production

# Create ZIP file
echo "🗜️  Creating ZIP file..."
zip -r contact-form-handler.zip . -x "*.git*" "node_modules/.cache/*" "deploy.sh" "README.md"

# Deploy using CloudFormation
echo "☁️  Deploying to AWS CloudFormation..."
aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        FromEmail=$FROM_EMAIL \
        ToEmail=$TO_EMAIL \
        Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

# Get the API Gateway URL
echo "🔗 Getting API Gateway URL..."
API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
    --output text)

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Verify your email addresses in AWS SES:"
echo "   - From email: $FROM_EMAIL"
echo "   - To email: $TO_EMAIL"
echo ""
echo "2. Update your contact form with the API Gateway URL:"
echo "   API URL: $API_URL"
echo ""
echo "3. If you're in SES sandbox mode, you can only send to verified email addresses."
echo "   To move out of sandbox mode, request production access in the SES console."
echo ""
echo "4. Test the contact form to ensure it's working correctly."

# Clean up
rm -f contact-form-handler.zip 