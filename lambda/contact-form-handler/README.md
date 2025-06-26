# Contact Form Handler - AWS Lambda Function

This AWS Lambda function handles contact form submissions from your website and sends emails using AWS SES (Simple Email Service).

## Features

- ✅ Form validation (client and server-side)
- ✅ Email format validation
- ✅ CORS support for cross-origin requests
- ✅ Professional HTML email templates
- ✅ Error handling and user feedback
- ✅ AWS SES integration
- ✅ API Gateway integration

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure the AWS CLI
3. **Node.js**: Version 18 or higher (for local development)
4. **Verified Email Addresses**: Both sender and recipient emails must be verified in AWS SES

## Setup Instructions

### 1. Install AWS CLI and Configure Credentials

```bash
# Install AWS CLI (macOS)
brew install awscli

# Or download from: https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
```

### 2. Verify Email Addresses in AWS SES

1. Go to the AWS SES Console
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Choose "Email address"
5. Enter your email addresses:
   - `noreply@yourdomain.com` (or your preferred sender email)
   - `contact@hindsight.com.au` (your contact email)
6. Check your email and click the verification link

### 3. Deploy the Lambda Function

```bash
# Navigate to the lambda directory
cd lambda/contact-form-handler

# Make the deployment script executable
chmod +x deploy.sh

# Edit the configuration in deploy.sh
# Update the following variables:
# - FROM_EMAIL: Your verified sender email
# - TO_EMAIL: Your verified recipient email
# - REGION: Your preferred AWS region

# Run the deployment script
./deploy.sh
```

### 4. Update Your Contact Form

After deployment, you'll get an API Gateway URL. Update your contact form JavaScript:

```javascript
// Replace 'YOUR_API_GATEWAY_URL_HERE' with the actual URL from deployment
const apiUrl =
	"https://your-api-gateway-url.execute-api.region.amazonaws.com/production/contact";
```

### 5. Test the Contact Form

1. Fill out the contact form on your website
2. Submit the form
3. Check your email for the received message
4. Verify the email formatting and content

## Configuration

### Environment Variables

The Lambda function uses the following environment variables:

- `FROM_EMAIL`: Email address to send from (must be verified in SES)
- `TO_EMAIL`: Email address to receive contact form submissions
- `AWS_REGION`: AWS region (automatically set)

### Customization

You can customize the email template by modifying the HTML and text content in the `index.js` file.

## SES Sandbox Mode

By default, AWS SES accounts are in sandbox mode, which means:

- You can only send emails to verified email addresses
- You have a limited sending quota

To move out of sandbox mode:

1. Go to AWS SES Console
2. Navigate to "Account dashboard"
3. Click "Request production access"
4. Fill out the form with your use case
5. Wait for approval (usually 24-48 hours)

## Troubleshooting

### Common Issues

1. **"Email address not verified" error**

   - Ensure both sender and recipient emails are verified in SES
   - Check that you're using the exact verified email addresses

2. **CORS errors**

   - The Lambda function includes CORS headers
   - Ensure your website domain is allowed in the CORS configuration

3. **"Access denied" errors**

   - Check that the Lambda function has the correct IAM permissions
   - Verify that SES is enabled in your AWS region

4. **Form not submitting**
   - Check the browser console for JavaScript errors
   - Verify the API Gateway URL is correct
   - Ensure the form fields match the expected names (name, email, subject, message)

### Logs and Monitoring

- View Lambda function logs in CloudWatch
- Monitor API Gateway requests in the API Gateway console
- Check SES sending statistics in the SES console

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **Input Validation**: The function validates all inputs, but consider additional sanitization
3. **CORS**: The function allows all origins (`*`). Consider restricting to your domain
4. **API Keys**: Consider adding API key authentication for production use

## Cost Estimation

- **Lambda**: ~$0.20 per million requests
- **API Gateway**: ~$3.50 per million requests
- **SES**: $0.10 per 1,000 emails sent

For a typical website with 100 contact form submissions per month, the total cost would be less than $1/month.

## Support

If you encounter any issues:

1. Check the AWS CloudWatch logs for the Lambda function
2. Verify your AWS credentials and permissions
3. Ensure all email addresses are verified in SES
4. Test the API endpoint directly using curl or Postman

## License

MIT License - feel free to modify and use as needed.
