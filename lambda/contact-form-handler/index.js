const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: process.env.AWS_REGION || "ap-southeast-2" });

exports.handler = async (event) => {
	// Enable CORS
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
		"Access-Control-Allow-Methods": "POST,OPTIONS",
		"Content-Type": "application/json",
	};

	// Handle preflight OPTIONS request
	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({ message: "OK" }),
		};
	}

	try {
		// Parse the request body
		const body = JSON.parse(event.body);
		const { name, email, subject, message } = body;

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					error: "Missing required fields",
					errors: [
						{ field: "name", message: !name ? "Name is required" : null },
						{ field: "email", message: !email ? "Email is required" : null },
						{
							field: "subject",
							message: !subject ? "Subject is required" : null,
						},
						{
							field: "message",
							message: !message ? "Message is required" : null,
						},
					].filter((error) => error.message),
				}),
			};
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return {
				statusCode: 400,
				headers: headers,
				body: JSON.stringify({
					error: "Invalid email format",
					errors: [
						{ field: "email", message: "Please enter a valid email address" },
					],
				}),
			};
		}

		// Prepare email content
		const emailParams = {
			Source: process.env.FROM_EMAIL || "noreply@hindsight.com.au",
			Destination: {
				ToAddresses: [process.env.TO_EMAIL || "studio@hindsight.com.au"],
				CcAddresses: [process.env.CC_EMAIL || "christoph@theapphub.com.au"],
			},
			Message: {
				Subject: {
					Data: `New Contact Form Submission: ${subject}`,
					Charset: "UTF-8",
				},
				Body: {
					Html: {
						Data: `
                            <html>
                                <head>
                                    <style>
                                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                                        .field { margin-bottom: 15px; }
                                        .label { font-weight: bold; color: #555; }
                                        .value { background-color: #f8f9fa; padding: 10px; border-radius: 3px; }
                                        .message-box { background-color: #f8f9fa; padding: 15px; border-radius: 3px; white-space: pre-wrap; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="header">
                                            <h2>New Contact Form Submission</h2>
                                            <p>A new message has been submitted through your website contact form.</p>
                                        </div>
                                        
                                        <div class="field">
                                            <div class="label">Name:</div>
                                            <div class="value">${name}</div>
                                        </div>
                                        
                                        <div class="field">
                                            <div class="label">Email:</div>
                                            <div class="value">${email}</div>
                                        </div>
                                        
                                        <div class="field">
                                            <div class="label">Subject:</div>
                                            <div class="value">${subject}</div>
                                        </div>
                                        
                                        <div class="field">
                                            <div class="label">Message:</div>
                                            <div class="message-box">${message}</div>
                                        </div>
                                        
                                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                                            <p>This message was sent from your website contact form at ${new Date().toLocaleString()}</p>
                                        </div>
                                    </div>
                                </body>
                            </html>
                        `,
						Charset: "UTF-8",
					},
					Text: {
						Data: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your website contact form at ${new Date().toLocaleString()}
                        `,
						Charset: "UTF-8",
					},
				},
			},
		};

		// Send email using SES
		await ses.sendEmail(emailParams).promise();

		// Return success response
		return {
			statusCode: 200,
			headers: headers,
			body: JSON.stringify({
				message: "Message sent successfully!",
				success: true,
			}),
		};
	} catch (error) {
		console.error("Error sending email:", error);

		return {
			statusCode: 500,
			headers: headers,
			body: JSON.stringify({
				error: "Failed to send message. Please try again later.",
				success: false,
			}),
		};
	}
};
