#!/bin/bash

# Contact Form Lambda Function Deployment Script
# This script deploys the Lambda function using AWS CloudFormation

set -e

# Configuration
STACK_NAME="hindsight-contact-form-stack"
REGION="ap-southeast-2"  # Change this to your preferred region

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Lambda function deployment...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials are not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Prompt for email addresses
echo -e "${YELLOW}📧 Please provide the email addresses for the contact form:${NC}"
read -p "From email (must be verified in SES): " FROM_EMAIL
read -p "To email (where to receive contact form submissions): " TO_EMAIL

if [ -z "$FROM_EMAIL" ] || [ -z "$TO_EMAIL" ]; then
    echo -e "${RED}❌ Both email addresses are required.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Email addresses configured:${NC}"
echo "  From: $FROM_EMAIL"
echo "  To: $TO_EMAIL"

# Deploy the CloudFormation stack
echo -e "${YELLOW}📦 Deploying CloudFormation stack...${NC}"

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        FromEmail=$FROM_EMAIL \
        ToEmail=$TO_EMAIL \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Get the API endpoint
echo -e "${YELLOW}🔍 Getting API endpoint...${NC}"
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

if [ "$API_ENDPOINT" = "None" ]; then
    echo -e "${RED}❌ Failed to get API endpoint. Please check the CloudFormation stack.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 API Endpoint: $API_ENDPOINT${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your contact form with the API endpoint above"
echo "2. Verify your email addresses in AWS SES"
echo "3. Test the contact form"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "- Make sure your FROM_EMAIL is verified in AWS SES"
echo "- If you're in SES sandbox mode, your TO_EMAIL must also be verified"
echo "- To move out of sandbox mode, request production access in SES" 