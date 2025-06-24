// Suppress passive event listener warnings for GSAP/ScrollTrigger
const originalWarn = console.warn;
console.warn = function (...args) {
	if (
		args[0] &&
		typeof args[0] === "string" &&
		args[0].includes("passive event listener")
	) {
		return; // Suppress passive event listener warnings
	}
	originalWarn.apply(console, args);
};

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
	console.log(
		"🔍 DOMContentLoaded event fired - checking for animation elements",
	);

	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		console.error("❌ GSAP and ScrollTrigger not loaded!");
		return;
	}

	console.log("✅ GSAP and ScrollTrigger are available");

	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			console.log(
				"🖥️ Desktop/tablet media query matched - initializing animation",
			);

			// Apply on desktop/tablet

			const scrollContainer = document.querySelector(".scroll-container");
			console.log("📦 Scroll container found:", !!scrollContainer);

			if (!scrollContainer) {
				console.warn(
					"⚠️ No scroll container found - animation will not initialize",
				);
				return;
			}

			const leftColumn = scrollContainer.querySelector(".left-column");
			const leftContent = leftColumn?.querySelector(".image-gallery-inner"); // The content to animate
			const rightColumn = scrollContainer.querySelector(".right-column");
			const rightContent = rightColumn?.querySelector(".right-content-inner"); // The element to pin
			const triggerElement = rightContent?.querySelector(".post-title"); // H1 title as trigger

			console.log("🔍 Animation elements found:", {
				leftColumn: !!leftColumn,
				leftContent: !!leftContent,
				rightColumn: !!rightColumn,
				rightContent: !!rightContent,
				triggerElement: !!triggerElement,
			});

			if (
				!leftColumn ||
				!leftContent ||
				!rightColumn ||
				!rightContent ||
				!triggerElement
			) {
				console.warn(
					"⚠️ Scroll animation elements not found - animation will not initialize",
				);
				return;
			}

			console.log(
				"✅ All animation elements found - waiting for images to load",
			);

			// Function to initialize the animation after images are loaded
			function initializeScrollAnimation() {
				console.log("🎬 Initializing scroll animation after images loaded");

				// Calculate the total height the left content needs to scroll *within its container*
				const leftScrollDistance =
					leftContent.scrollHeight - leftColumn.clientHeight;

				console.log("📏 Scroll distance calculated:", {
					leftContentScrollHeight: leftContent.scrollHeight,
					leftColumnClientHeight: leftColumn.clientHeight,
					leftScrollDistance: leftScrollDistance,
				});

				// Add a buffer to the end point to ensure the footer clears
				const endBuffer = 400;

				// Only create the animation if there is scrollable content in the left column
				if (leftScrollDistance > 0) {
					console.log("🎬 Creating scroll animation with timeline");

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
								console.log(
									"🔄 ScrollTrigger toggled:",
									self.isActive ? "active" : "inactive",
								);
								if (self.isActive) {
									leftColumn.classList.add("is-sticky-scrolling");
									console.log("📌 Added is-sticky-scrolling class");
								} else {
									leftColumn.classList.remove("is-sticky-scrolling");
									console.log("📌 Removed is-sticky-scrolling class");
								}
							},
							onRefresh: () => {
								console.log("🔄 ScrollTrigger refreshed");
							},
							onRefreshInit: () => {
								console.log("🔄 ScrollTrigger refresh initialized");
							},
						},
					});

					// Animate the translateY of the inner image gallery
					// Ensure the animation duration matches the actual scrollable distance
					tl.to(leftContent, { y: -leftScrollDistance }); // <--- Animation still uses leftScrollDistance

					console.log("✅ Scroll animation timeline created successfully");
				} else {
					console.log(
						"📏 No scrollable content - creating fallback pin animation",
					);

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

					console.log("✅ Fallback pin animation created");
				}
			}

			// Check if all images are already loaded
			const images = leftContent.querySelectorAll("img");
			console.log("🖼️ Found", images.length, "images in gallery");

			if (images.length === 0) {
				console.log("⚠️ No images found - initializing animation immediately");
				initializeScrollAnimation();
				return;
			}

			let loadedImages = 0;
			let hasInitialized = false;

			// Function to check if all images are loaded and initialize animation
			function checkAllImagesLoaded() {
				if (hasInitialized) return;

				if (loadedImages === images.length) {
					console.log("✅ All images loaded - initializing animation");
					hasInitialized = true;

					// Small delay to ensure DOM is fully updated
					setTimeout(() => {
						initializeScrollAnimation();
					}, 50);
				}
			}

			// Check each image
			images.forEach((img, index) => {
				if (img.complete && img.naturalHeight !== 0) {
					loadedImages++;
					console.log(`🖼️ Image ${index + 1} already loaded`);
					checkAllImagesLoaded();
				} else {
					img.addEventListener("load", () => {
						loadedImages++;
						console.log(
							`🖼️ Image ${index + 1} loaded (${loadedImages}/${images.length})`,
						);
						checkAllImagesLoaded();
					});

					img.addEventListener("error", () => {
						console.warn(`❌ Image ${index + 1} failed to load`);
						loadedImages++; // Count as loaded to prevent infinite waiting
						checkAllImagesLoaded();
					});
				}
			});

			// Fallback: if images take too long to load, initialize anyway
			setTimeout(() => {
				if (!hasInitialized) {
					console.log("⏰ Timeout reached - initializing animation anyway");
					hasInitialized = true;
					initializeScrollAnimation();
				}
			}, 3000); // 3 second timeout
		},

		"(max-width: 767px)": function () {
			console.log("📱 Mobile media query matched - killing ScrollTrigger");

			// Kill ScrollTrigger on mobile
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			document.querySelectorAll(".left-column").forEach((col) => {
				col.classList.remove("is-sticky-scrolling"); // Clean up debug class
			});
		},
	});
});

// Add window load event listener as additional fallback
window.addEventListener("load", () => {
	console.log("🌐 Window load event fired - all resources loaded");

	// Check if we're on a work page and animation hasn't been initialized
	const scrollContainer = document.querySelector(".scroll-container");
	if (scrollContainer) {
		console.log(
			"📦 Window load: Scroll container found, checking if animation needs refresh",
		);

		// Force a refresh of ScrollTrigger after all images are loaded
		setTimeout(() => {
			console.log("🔄 Forcing ScrollTrigger refresh after window load");
			ScrollTrigger.refresh();
		}, 100);
	}
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
