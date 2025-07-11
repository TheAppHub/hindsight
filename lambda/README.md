# Contact Form Lambda Function

This Lambda function replaces Formspree with AWS SES for handling contact form submissions.

## Features

- ✅ Handles contact form submissions via API Gateway
- ✅ Sends emails using AWS SES
- ✅ CORS enabled for cross-origin requests
- ✅ Input validation
- ✅ Error handling
- ✅ HTML and text email formats

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI
3. **AWS SES Setup**:
   - Verify your sender email address in SES
   - If in sandbox mode, verify recipient email addresses too
   - Request production access if needed

## Quick Deployment

### Option 1: Using the deployment script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will:

- Check prerequisites
- Prompt for email addresses
- Deploy the CloudFormation stack
- Output the API endpoint URL

### Option 2: Manual deployment

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Create deployment package**:

   ```bash
   npm run package
   ```

3. **Deploy using AWS CLI**:
   ```bash
   aws cloudformation deploy \
     --template-file template.yaml \
     --stack-name contact-form-stack \
     --parameter-overrides \
       FromEmail=your-verified-email@domain.com \
       ToEmail=contact@domain.com \
     --capabilities CAPABILITY_IAM \
     --region ap-southeast-2
   ```

## Configuration

### Environment Variables

The Lambda function uses these environment variables:

- `FROM_EMAIL`: Email address to send from (must be verified in SES)
- `TO_EMAIL`: Email address to receive contact form submissions

### Email Verification

Before deployment, verify your email addresses in AWS SES:

1. Go to AWS SES Console
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Choose "Email address"
5. Enter your email and follow verification steps

## Updating the Contact Form

After deployment, update your contact form with the API endpoint:

1. Get the API endpoint from CloudFormation outputs
2. Replace `YOUR_LAMBDA_API_ENDPOINT` in the contact form with the actual endpoint
3. The endpoint will look like: `https://abc123.execute-api.us-east-1.amazonaws.com/prod/contact`

## Testing

Test the contact form by:

1. Filling out the form on your website
2. Submitting the form
3. Checking your email for the submission
4. Checking CloudWatch logs for any errors

## Troubleshooting

### Common Issues

1. **Email not received**:

   - Check if emails are verified in SES
   - Check if you're in sandbox mode
   - Check CloudWatch logs for errors

2. **CORS errors**:

   - The function includes CORS headers
   - Make sure your domain is allowed

3. **Permission errors**:
   - Check IAM roles and policies
   - Ensure Lambda has SES permissions

### CloudWatch Logs

To view logs:

```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/contact-form-handler"
```

## Cost Estimation

- **Lambda**: ~$0.20 per million requests
- **API Gateway**: ~$3.50 per million requests
- **SES**: ~$0.10 per 1,000 emails

## Security Considerations

- The function validates input but doesn't sanitize HTML
- Consider adding rate limiting
- Consider adding CAPTCHA for spam protection
- Monitor for abuse and adjust accordingly

## Cleanup

To delete the stack:

```bash
aws cloudformation delete-stack --stack-name contact-form-stack
```

## Support

For issues or questions:

1. Check CloudWatch logs
2. Verify email addresses in SES
3. Test the API endpoint directly
4. Check IAM permissions
