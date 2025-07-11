const AWS = require("aws-sdk");

// Configure AWS SES
const ses = new AWS.SES({
	region: process.env.AWS_REGION || "ap-southeast-2",
});

exports.handler = async (event) => {
	// Enable CORS with more comprehensive headers
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers":
			"Content-Type, Accept, Authorization, X-Requested-With",
		"Access-Control-Allow-Methods": "POST, OPTIONS, GET",
		"Access-Control-Max-Age": "86400",
		"Content-Type": "application/json",
	};

	// Handle preflight requests
	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers,
			body: "",
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
				headers,
				body: JSON.stringify({
					error: "Missing required fields",
				}),
			};
		}

		// Email parameters
		const params = {
			Source: process.env.FROM_EMAIL || "website@hindsight.com.au",
			Destination: {
				ToAddresses: [process.env.TO_EMAIL || "christoph@hindsight.com.au"],
			},
			Message: {
				Subject: {
					Data: `New Contact Form Submission: ${subject}`,
					Charset: "UTF-8",
				},
				Body: {
					Text: {
						Data: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your website contact form.
            `,
						Charset: "UTF-8",
					},
					Html: {
						Data: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>
<hr>
<p><em>This message was sent from your website contact form.</em>
            `,
						Charset: "UTF-8",
					},
				},
			},
		};

		// Send email via SES
		await ses.sendEmail(params).promise();

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				message: "Email sent successfully",
			}),
		};
	} catch (error) {
		console.error("Error sending email:", error);

		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error: "Failed to send email",
			}),
		};
	}
};
