#!/usr/bin/env node

/**
 * Test script for the Contact Form API
 * Usage: node test-api.js <API_URL>
 * Example: node test-api.js https://abc123.execute-api.us-east-1.amazonaws.com/production/contact
 */

const https = require("https");
const url = require("url");

// Test data
const testData = {
	name: "John Doe",
	email: "john.doe@example.com",
	subject: "Test Contact Form Submission",
	message:
		"This is a test message from the contact form. Please ignore this email.",
};

function makeRequest(apiUrl, data) {
	return new Promise((resolve, reject) => {
		const parsedUrl = url.parse(apiUrl);

		const postData = JSON.stringify(data);

		const options = {
			hostname: parsedUrl.hostname,
			port: parsedUrl.port || 443,
			path: parsedUrl.path,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": Buffer.byteLength(postData),
			},
		};

		const req = https.request(options, (res) => {
			let responseData = "";

			res.on("data", (chunk) => {
				responseData += chunk;
			});

			res.on("end", () => {
				try {
					const parsedResponse = JSON.parse(responseData);
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						body: parsedResponse,
					});
				} catch (error) {
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						body: responseData,
					});
				}
			});
		});

		req.on("error", (error) => {
			reject(error);
		});

		req.write(postData);
		req.end();
	});
}

async function testAPI() {
	const apiUrl = process.argv[2];

	if (!apiUrl) {
		console.error("❌ Please provide the API URL as an argument");
		console.log("Usage: node test-api.js <API_URL>");
		console.log(
			"Example: node test-api.js https://abc123.execute-api.us-east-1.amazonaws.com/production/contact",
		);
		process.exit(1);
	}

	console.log("🧪 Testing Contact Form API...");
	console.log(`📡 API URL: ${apiUrl}`);
	console.log(`📝 Test Data:`, testData);
	console.log("");

	try {
		const response = await makeRequest(apiUrl, testData);

		console.log("📊 Response:");
		console.log(`Status Code: ${response.statusCode}`);
		console.log("Headers:", JSON.stringify(response.headers, null, 2));
		console.log("Body:", JSON.stringify(response.body, null, 2));

		if (response.statusCode === 200 && response.body.success) {
			console.log("");
			console.log("✅ Test passed! The API is working correctly.");
			console.log("📧 Check your email for the test message.");
		} else {
			console.log("");
			console.log("❌ Test failed! Check the response for errors.");
		}
	} catch (error) {
		console.error("❌ Error testing API:", error.message);
		console.log("");
		console.log("🔍 Troubleshooting tips:");
		console.log("1. Verify the API URL is correct");
		console.log("2. Ensure the Lambda function is deployed");
		console.log("3. Check that email addresses are verified in SES");
		console.log("4. Review CloudWatch logs for the Lambda function");
	}
}

// Test validation errors
async function testValidation() {
	const apiUrl = process.argv[2];

	if (!apiUrl) {
		return;
	}

	console.log("");
	console.log("🧪 Testing validation errors...");

	const invalidData = {
		name: "",
		email: "invalid-email",
		subject: "",
		message: "",
	};

	try {
		const response = await makeRequest(apiUrl, invalidData);

		console.log("📊 Validation Test Response:");
		console.log(`Status Code: ${response.statusCode}`);
		console.log("Body:", JSON.stringify(response.body, null, 2));

		if (response.statusCode === 400 && response.body.errors) {
			console.log(
				"✅ Validation test passed! The API correctly rejected invalid data.",
			);
		} else {
			console.log(
				"❌ Validation test failed! The API should have rejected invalid data.",
			);
		}
	} catch (error) {
		console.error("❌ Error testing validation:", error.message);
	}
}

// Run tests
async function runTests() {
	await testAPI();
	await testValidation();
}

runTests().catch(console.error);
