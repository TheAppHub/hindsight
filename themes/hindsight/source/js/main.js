gsap.registerPlugin(ScrollTrigger);

// ——————————————————————————————————————————————————
// Navigation
// ——————————————————————————————————————————————————

document.addEventListener("DOMContentLoaded", () => {
	const hamburger = document.querySelector("#hamburger");
	const nav = document.querySelector("#nav");
	const navLi = document.querySelectorAll("#nav > li");
	hamburger.addEventListener("click", () => {
		hamburger.classList.toggle("mobile-hamburger");
		nav.classList.toggle("show-nav");
	});
	navLi.forEach((li) => {
		li.addEventListener("click", () => {
			nav.classList.remove("show-nav");
			hamburger.classList.remove("mobile-hamburger");
		});
	});
});

document.addEventListener("DOMContentLoaded", function () {
	var user = "studio"; // Replace with the part before the @
	var domain = "hindsight.com.au"; // Replace with the part after the @
	var email = user + "@" + domain;
	var emailLink = document.createElement("a");
	emailLink.href = "mailto:" + email;
	emailLink.textContent = email;
	const emailField = document.getElementById("emailAddress");
	if (emailField) {
		emailField.appendChild(emailLink);
	}
});

// ——————————————————————————————————————————————————
// Contact form
// ——————————————————————————————————————————————————

document.addEventListener("DOMContentLoaded", function () {
	// Get both forms individually
	var contactForm = document.getElementById("contactForm");

	var loadingStatus = document.getElementById("formLoading");
	var formSuccess = document.getElementById("formSuccess");
	var errorStatus = document.getElementById("formError");

	// Ensure the status messages are hidden initially
	if (loadingStatus) loadingStatus.classList.add("hidden");
	if (formSuccess) formSuccess.classList.add("hidden");
	if (errorStatus) errorStatus.classList.add("hidden");

	async function handleSubmit(event) {
		event.preventDefault();

		// Determine which form was submitted
		const submittedForm = event.target;

		if (loadingStatus) loadingStatus.classList.remove("hidden");
		if (formSuccess) formSuccess.classList.add("hidden");
		if (errorStatus) errorStatus.classList.add("hidden");

		var formData = new FormData(submittedForm);

		fetch(submittedForm.action, {
			method: submittedForm.method,
			body: formData,
			headers: {
				Accept: "application/json",
			},
		})
			.then((response) => {
				if (response.ok) {
					if (loadingStatus) loadingStatus.classList.add("hidden");
					if (formSuccess) formSuccess.classList.remove("hidden");
					if (errorStatus) errorStatus.classList.add("hidden");
					submittedForm.reset(); // Reset the specific form that was submitted
				} else {
					response.json().then((data) => {
						if (loadingStatus) loadingStatus.classList.add("hidden");
						if (formSuccess) formSuccess.classList.add("hidden");
						if (errorStatus) errorStatus.classList.remove("hidden");

						// You might want to display errors specific to the submitted form
						const errors = data["errors"]
							.map((error) => error["message"])
							.join(", ");
						console.error("Form submission errors: ", errors); // Use console.error for errors
						// Consider displaying these errors to the user near the relevant form
					});
				}
			})
			.catch((error) => {
				if (loadingStatus) loadingStatus.classList.add("hidden");
				if (formSuccess) formSuccess.classList.add("hidden");
				if (errorStatus) errorStatus.classList.remove("hidden");
				console.error("Form submission failed: ", error); // Use console.error
				// Display a generic error message to the user
			});
	}

	// Attach the event listener to both forms if they exist
	if (contactForm) {
		contactForm.addEventListener("submit", handleSubmit);
	}
});

// ——————————————————————————————————————————————————
// Scrolling
// ——————————————————————————————————————————————————

// src/js/post-scroll.js
document.addEventListener("DOMContentLoaded", () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		console.error("GSAP and ScrollTrigger not loaded!");
		return;
	}

	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			// Apply on desktop/tablet

			const scrollContainer = document.querySelector(".scroll-container");
			if (!scrollContainer) {
				return;
			}

			const leftColumn = scrollContainer.querySelector(".left-column");
			const leftContent = leftColumn.querySelector(".image-gallery-inner"); // The content to animate
			const rightColumn = scrollContainer.querySelector(".right-column");
			const rightContent = rightColumn.querySelector(".right-content-inner"); // The element to pin
			const triggerElement = rightContent.querySelector(".post-title"); // H1 title as trigger

			if (
				!leftColumn ||
				!leftContent ||
				!rightColumn ||
				!rightContent ||
				!triggerElement
			) {
				console.warn("Scroll animation elements not found.");
				return;
			}

			// Calculate the total height the left content needs to scroll *within its container*
			const leftScrollDistance =
				leftContent.scrollHeight - leftColumn.clientHeight;

			// Add a buffer to the end point to ensure the footer clears
			const endBuffer = 400; // Adjust this value as needed (in pixels)

			// Only create the animation if there is scrollable content in the left column
			if (leftScrollDistance > 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: triggerElement, // Start when H1 hits the top
						start: "top top",
						// Add the buffer to the end point
						end: "+=" + (leftScrollDistance + endBuffer), // <--- MODIFIED LINE
						scrub: true,
						pin: rightContent, // Pin the right column content
						pinSpacing: true, // Maintain space for the pinned element
						// markers: true, // Uncomment for debugging
						onToggle: (self) => {
							if (self.isActive) {
								leftColumn.classList.add("is-sticky-scrolling");
							} else {
								leftColumn.classList.remove("is-sticky-scrolling");
							}
						},
					},
				});

				// Animate the translateY of the inner image gallery
				// Ensure the animation duration matches the actual scrollable distance
				tl.to(leftContent, { y: -leftScrollDistance }); // <--- Animation still uses leftScrollDistance
			} else {
				// Fallback: if left column content is shorter than the viewport,
				// just pin the right column when the H1 reaches the top.
				ScrollTrigger.create({
					trigger: triggerElement,
					start: "top top",
					pin: rightContent,
					pinSpacing: true,
					// Add buffer to the fallback pin as well if it exists
					end: "+=" + endBuffer, // <--- MODIFIED LINE for fallback
					// markers: true // Uncomment for debugging
				});
			}
		},

		"(max-width: 767px)": function () {
			// Kill ScrollTrigger on mobile
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			document.querySelectorAll(".left-column").forEach((col) => {
				col.classList.remove("is-sticky-scrolling"); // Clean up debug class
			});
		},
	});
});

document.addEventListener("DOMContentLoaded", () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		console.error("GSAP and ScrollTrigger not loaded!");
		return;
	}

	gsap.utils.toArray(".gsap-parallax-image").forEach((image) => {
		gsap.to(image, {
			yPercent: 25,
			ease: "none",
			scrollTrigger: {
				trigger: image,
				start: "top bottom", // when image enters the viewport
				end: "bottom top", // when image leaves the viewport
				scrub: true, // ties animation to scroll
			},
		});
	});
});

// ——————————————————————————————————————————————————
// Services Page Parallax Effect
// ——————————————————————————————————————————————————

let parallaxInitialized = false;

// Function to initialize parallax
function initParallax() {
	// Prevent multiple initializations
	if (parallaxInitialized) {
		return;
	}

	// Check if we're on the services page by looking for the services layout and URL
	const isServicesPage =
		window.location.pathname.includes("/services") ||
		window.location.pathname.includes("/creative-services") ||
		document.querySelector("section.bg-white .service");

	if (!isServicesPage) {
		return;
	}

	// Check if GSAP and ScrollTrigger are available
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		return;
	}

	// Only apply parallax on desktop/tablet
	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			const parallaxImages = document.querySelectorAll(".parallax-image");

			if (parallaxImages.length === 0) {
				return;
			}

			parallaxImages.forEach((image) => {
				// Add overflow hidden to container to prevent image overflow
				const container = image.closest(".parallax-container");
				if (container) {
					container.style.overflow = "hidden";
				}

				// Create the parallax animation
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: image,
						start: "top bottom",
						end: "bottom top",
						scrub: 1, // Smooth scrubbing with 1 second delay
						markers: false,
					},
				});

				tl.to(image, {
					yPercent: -40,
					ease: "none",
				});
			});

			// Mark as initialized
			parallaxInitialized = true;
		},

		"(max-width: 767px)": function () {
			// Kill parallax ScrollTriggers on mobile for better performance
			ScrollTrigger.getAll().forEach((trigger) => {
				if (
					trigger.vars.trigger &&
					trigger.vars.trigger.classList.contains("parallax-image")
				) {
					trigger.kill();
				}
			});
		},
	});
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", initParallax);

// Also try on window load as a fallback
window.addEventListener("load", () => {
	// Small delay to ensure everything is ready
	setTimeout(initParallax, 100);
});
