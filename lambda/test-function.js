// Test script for the Lambda function
const fetch = require("node-fetch");

async function testContactForm() {
	const testData = {
		name: "Test User",
		email: "test@example.com",
		subject: "Test Message",
		message: "This is a test message from the contact form.",
	};

	try {
		console.log("Testing contact form submission...");

		const response = await fetch("YOUR_NEW_API_ENDPOINT", {
			method: "POST",
			body: JSON.stringify(testData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("Response status:", response.status);
		console.log("Response headers:", response.headers);

		const responseText = await response.text();
		console.log("Response body:", responseText);

		if (response.ok) {
			console.log("✅ Test passed! Form submission successful.");
		} else {
			console.log("❌ Test failed! Form submission unsuccessful.");
		}
	} catch (error) {
		console.error("❌ Test failed with error:", error.message);
	}
}

// Run the test
testContactForm();
