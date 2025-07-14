const AWS = require("aws-sdk");

// Configure AWS SES
const ses = new AWS.SES({
	region: process.env.AWS_REGION || "ap-southeast-2",
});

const ALLOWED_ORIGINS = [
	"http://localhost:4000",
	"http://localhost:3000",
	"http://localhost:8080",
	"https://hindsight.com.au",
	"https://www.hindsight.com.au",
];

const REQUIRED_FIELDS = ["name", "email", "subject", "message"];

function getCorsHeaders(origin) {
	// Check if the origin is in our allowed list
	const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
		? origin
		: ALLOWED_ORIGINS[0];

	return {
		"Access-Control-Allow-Origin": allowedOrigin,
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Methods": "POST, OPTIONS",
	};
}

exports.handler = async (event) => {
	const origin = event.headers?.origin || "";

	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers: getCorsHeaders(origin),
			body: "",
		};
	}

	try {
		if (!event.body) {
			console.warn("No body in request");
			return {
				statusCode: 400,
				headers: getCorsHeaders(origin),
				body: JSON.stringify({ message: "Missing request body" }),
			};
		}

		const data = JSON.parse(event.body);

		const missingFields = REQUIRED_FIELDS.filter((field) => !data[field]);
		if (missingFields.length > 0) {
			console.warn("Missing required fields:", missingFields);
			return {
				statusCode: 400,
				headers: getCorsHeaders(origin),
				body: JSON.stringify({
					message: `Missing required fields: ${missingFields.join(", ")}`,
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
					Data: `New Contact Form Submission: ${data.subject}`,
					Charset: "UTF-8",
				},
				Body: {
					Text: {
						Data: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent from your website contact form.
            `,
						Charset: "UTF-8",
					},
					Html: {
						Data: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<p><strong>Message:</strong></p>
<p>${data.message.replace(/\n/g, "<br>")}</p>
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

		console.log("Form submission successful");
		return {
			statusCode: 200,
			headers: getCorsHeaders(origin),
			body: JSON.stringify({ message: "Form submitted successfully!" }),
		};
	} catch (error) {
		console.error("Unexpected error in Lambda:", error);
		return {
			statusCode: 500,
			headers: getCorsHeaders(origin),
			body: JSON.stringify({ message: "Error processing form." }),
		};
	}
};
