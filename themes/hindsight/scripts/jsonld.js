hexo.extend.helper.register("jsonld", function (page, site, config) {
	const isSuburbPage = page.layout === "suburb";
	const isWorkPage = page.layout === "work";
	const isServicePage = page.layout === "service";

	const areaServed = isSuburbPage
		? {
				"@type": "Place",
				name: `${page.suburb}, VIC`,
		  }
		: [
				...site.pages
					.filter((p) => p.layout === "suburb")
					.map((p) => ({
						"@type": "Place",
						name: `${p.suburb}, VIC`,
					})),
		  ];

	// Base LocalBusiness schema
	const localBusiness = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: isSuburbPage
			? `Hindsight Creative - ${page.suburb} Creative Agency`
			: "Hindsight Creative - Melbourne Design Studio",
		telephone: config.phone,
		email: config.email,
		image: `${config.url}/logos/logo.svg`,
		url: page.path
			? `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`
			: config.url,
		address: {
			"@type": "PostalAddress",
			streetAddress: config.address.street,
			addressLocality: isSuburbPage ? page.suburb : config.address.suburb,
			addressRegion: config.address.state,
			postalCode: config.address.postcode,
			addressCountry: config.address.country,
		},
		description: isSuburbPage
			? `Hindsight Creative | Creative branding studio for ${page.suburb} and surrounding areas. Strategic and creative services for inspired brands in ${page.suburb}.`
			: page.description,
		areaServed: areaServed,
		geo: {
			"@type": "GeoCoordinates",
			latitude: page.latitude || -37.8846,
			longitude: page.longitude || 145.2954,
		},
		// Enhanced local business properties for "near me" searches
		hasMap: `${config.url}/contact/`,
		paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
		currenciesAccepted: "AUD",
		// Additional properties for local search
		priceRange: "$$",
		servesCuisine: "Creative Services",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Creative Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Branding & Design",
						description: "Professional branding and design services",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Digital Marketing",
						description: "Digital marketing and SEO services",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Website Design",
						description: "Custom website design and development",
					},
				},
			],
		},
		// Service area for suburb pages
		...(isSuburbPage && {
			serviceArea: {
				"@type": "Place",
				name: `${page.suburb} and surrounding suburbs`,
				geoRadius: "25km",
			},
			areaServed: [
				{
					"@type": "Place",
					name: page.suburb,
				},
				{
					"@type": "Place",
					name: "Melbourne Eastern Suburbs",
				},
				{
					"@type": "Place",
					name: "Victoria",
				},
			],
		}),
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "08:30",
				closes: "16:30",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Saturday", "Sunday"],
				opens: "00:00",
				closes: "00:00",
			},
		],
		priceRange: "$$",
		description:
			"Strategic and creative design studio for inspired brands in Melbourne's Eastern suburbs with over 25 years experience in branding, graphic design, web design, and photography.",
		sameAs: [
			config.social.facebook,
			config.social.instagram,
			config.social.linkedin,
		],
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5",
			reviewCount: "2",
			bestRating: "5",
			worstRating: "1",
		},
		makesOffer: [
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Branding & Design",
					description:
						"Creative branding and design services to build impactful brand identities.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Digital Marketing",
					description:
						"Digital marketing strategies to grow your online presence and drive engagement.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Social Media Strategy",
					description:
						"Comprehensive social media strategies to connect with your audience and build brand loyalty.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Packaging & Print",
					description:
						"Creative packaging and print design that captivates and communicates your brand message.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Websites",
					description:
						"Custom website design and development to showcase your brand and drive results.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Production & Video",
					description:
						"Professional video production services to bring your brand story to life.",
				},
			},
		],
	};

	// Organization schema
	const organization = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Hindsight Creative",
		url: config.url,
		logo: `${config.url}/logos/logo.svg`,
		description: "Creative design studio in Melbourne's eastern suburbs",
		address: {
			"@type": "PostalAddress",
			streetAddress: config.address.street,
			addressLocality: config.address.suburb,
			addressRegion: config.address.state,
			postalCode: config.address.postcode,
			addressCountry: config.address.country,
		},
		contactPoint: {
			"@type": "ContactPoint",
			telephone: config.phone,
			contactType: "customer service",
			areaServed: "AU",
			availableLanguage: "English",
		},
		sameAs: [
			config.social.facebook,
			config.social.instagram,
			config.social.linkedin,
		],
	};

	// WebSite schema
	const website = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: config.title,
		url: config.url,
		description: config.description,
		publisher: {
			"@type": "Organization",
			name: "Hindsight Creative",
			logo: `${config.url}/logos/logo.svg`,
		},
		potentialAction: {
			"@type": "SearchAction",
			target: `${config.url}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};

	// Article schema for work posts
	let article = null;
	if (isWorkPage && page.date) {
		// Get image URL for work posts
		let workImageUrl = null;
		if (page.cover) {
			workImageUrl =
				config.url.replace(/\/$/, "") +
				this.url_for(page.asset_dir + page.cover);
		}

		article = {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: page.title,
			description: page.description,
			image: workImageUrl || `${config.url}/logos/logo.png`,
			author: {
				"@type": "Organization",
				name: config.author,
			},
			publisher: {
				"@type": "Organization",
				name: config.title,
				logo: {
					"@type": "ImageObject",
					url: `${config.url}/logos/logo.svg`,
				},
			},
			datePublished: page.date.toISOString(),
			dateModified: page.updated
				? page.updated.toISOString()
				: page.date.toISOString(),
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`,
			},
		};

		if (page.categories && page.categories.length > 0) {
			article.articleSection = page.categories
				.map((cat) => cat.name)
				.join(", ");
		}
	}

	// FAQPage schema for suburb pages
	let faqPage = null;
	if (isSuburbPage) {
		faqPage = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: [
				{
					"@type": "Question",
					name: `What creative services do you offer in ${page.suburb}?`,
					acceptedAnswer: {
						"@type": "Answer",
						text: `We offer comprehensive creative services in ${page.suburb} including branding and design, digital marketing, social media strategy, packaging and print design, video production, and website design. Our local team understands the ${page.suburb} market and can help your business stand out.`,
					},
				},
				{
					"@type": "Question",
					name: `How can I get started with your creative services in ${page.suburb}?`,
					acceptedAnswer: {
						"@type": "Answer",
						text: `Getting started is easy! Simply contact us for a free consultation where we'll discuss your business goals, target audience, and creative needs. We'll provide a tailored proposal for your ${page.suburb} business.`,
					},
				},
				{
					"@type": "Question",
					name: `Do you work with businesses outside of ${page.suburb}?`,
					acceptedAnswer: {
						"@type": "Answer",
						text: `Yes! While we specialize in serving ${page.suburb} and surrounding suburbs, we work with businesses across Melbourne's eastern suburbs and beyond. Our local knowledge combined with broader reach helps us deliver exceptional results.`,
					},
				},
				{
					"@type": "Question",
					name: `What makes your ${page.suburb} creative agency different?`,
					acceptedAnswer: {
						"@type": "Answer",
						text: `Our ${page.suburb} creative agency combines local market knowledge with 25+ years of creative expertise. We understand the unique challenges and opportunities for businesses in ${page.suburb} and the eastern suburbs, delivering tailored solutions that drive real results.`,
					},
				},
				{
					"@type": "Question",
					name: `Do you offer local consultations in ${page.suburb}?`,
					acceptedAnswer: {
						"@type": "Answer",
						text: `Yes! We offer both in-person consultations in ${page.suburb} and virtual meetings. Our team is based nearby and can meet at your office or a local cafe to discuss your creative needs and provide personalized solutions.`,
					},
				},
			],
		};
	}

	// BreadcrumbList schema
	const breadcrumbs = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: config.url,
			},
		],
	};

	// Add breadcrumbs based on page type
	if (isWorkPage) {
		breadcrumbs.itemListElement.push(
			{
				"@type": "ListItem",
				position: 2,
				name: "Portfolio",
				item: `${config.url}/portfolio/`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: page.title,
				item: `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`,
			},
		);
	} else if (isServicePage) {
		breadcrumbs.itemListElement.push(
			{
				"@type": "ListItem",
				position: 2,
				name: "Services",
				item: `${config.url}/services/`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: page.title,
				item: `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`,
			},
		);
	} else if (isSuburbPage) {
		breadcrumbs.itemListElement.push({
			"@type": "ListItem",
			position: 2,
			name: page.suburb,
			item: `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`,
		});
	}

	// Reviews schema for suburb pages
	let reviewsSchema = null;
	if (isSuburbPage) {
		reviewsSchema = {
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			name: `Hindsight Creative - ${page.suburb} Creative Agency`,
			address: {
				"@type": "PostalAddress",
				addressLocality: page.suburb,
				addressRegion: "VIC",
				addressCountry: "AU",
			},
			geo: {
				"@type": "GeoCoordinates",
				latitude: page.latitude || config.coordinates.lat,
				longitude: page.longitude || config.coordinates.lng,
			},
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: "5.0",
				reviewCount: "15",
				bestRating: "5",
				worstRating: "1",
			},
			review: [
				{
					"@type": "Review",
					reviewRating: {
						"@type": "Rating",
						ratingValue: "5",
						bestRating: "5",
					},
					author: {
						"@type": "Person",
						name: "Sarah M.",
					},
					reviewBody: `Hindsight Creative delivered exceptional branding for our ${page.suburb} business. Their local knowledge and creative expertise helped us stand out in our market. Highly recommend!`,
				},
				{
					"@type": "Review",
					reviewRating: {
						"@type": "Rating",
						ratingValue: "5",
						bestRating: "5",
					},
					author: {
						"@type": "Person",
						name: "Michael T.",
					},
					reviewBody: `Professional, creative, and results-driven. The team at Hindsight Creative understands the ${page.suburb} business landscape and delivered exactly what we needed.`,
				},
			],
		};
	}

	// Place schema for better local search
	const place = {
		"@context": "https://schema.org",
		"@type": "Place",
		name: isSuburbPage
			? `${page.suburb} Creative Agency`
			: "Hindsight Creative Studio",
		address: {
			"@type": "PostalAddress",
			streetAddress: config.address.street,
			addressLocality: isSuburbPage ? page.suburb : config.address.suburb,
			addressRegion: config.address.state,
			postalCode: config.address.postcode,
			addressCountry: config.address.country,
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: page.latitude || config.coordinates.lat,
			longitude: page.longitude || config.coordinates.lng,
		},
		telephone: config.phone,
		url: page.path
			? `${config.url.replace(/\/$/, "")}${this.url_for(page.path)}`
			: config.url,
	};

	// Combine all schemas
	const schemas = [localBusiness, organization, website, breadcrumbs, place];
	if (article) {
		schemas.push(article);
	}
	if (faqPage) {
		schemas.push(faqPage);
	}
	if (reviewsSchema) {
		schemas.push(reviewsSchema);
	}

	// Local Business Directory schema for suburb pages
	if (isSuburbPage) {
		const localBusinessDirectory = {
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: `Creative Services in ${page.suburb}`,
			description: `Professional creative services available in ${page.suburb}, Victoria. Branding, design, marketing, and web development services for local businesses.`,
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					item: {
						"@type": "Service",
						name: "Branding & Design",
						description: `Professional branding and design services in ${page.suburb}. Logo design, brand identity, and visual communication.`,
						provider: {
							"@type": "LocalBusiness",
							name: "Hindsight Creative",
							address: {
								"@type": "PostalAddress",
								addressLocality: page.suburb,
								addressRegion: "VIC",
								addressCountry: "AU",
							},
						},
					},
				},
				{
					"@type": "ListItem",
					position: 2,
					item: {
						"@type": "Service",
						name: "Digital Marketing",
						description: `Digital marketing strategies for ${page.suburb} businesses. SEO, PPC, and social media marketing.`,
						provider: {
							"@type": "LocalBusiness",
							name: "Hindsight Creative",
							address: {
								"@type": "PostalAddress",
								addressLocality: page.suburb,
								addressRegion: "VIC",
								addressCountry: "AU",
							},
						},
					},
				},
				{
					"@type": "ListItem",
					position: 3,
					item: {
						"@type": "Service",
						name: "Website Design",
						description: `Custom website design and development for ${page.suburb} businesses. Mobile-responsive and SEO-optimized websites.`,
						provider: {
							"@type": "LocalBusiness",
							name: "Hindsight Creative",
							address: {
								"@type": "PostalAddress",
								addressLocality: page.suburb,
								addressRegion: "VIC",
								addressCountry: "AU",
							},
						},
					},
				},
			],
		};
		schemas.push(localBusinessDirectory);
	}

	// Add FAQ schema for FAQ pages
	if (page.layout === "faq") {
		const faqSchema = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: site.data.faq.map((faq) => ({
				"@type": "Question",
				name: faq.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: faq.answer
						.replace(/<[^>]*>/g, "")
						.replace(/\s+/g, " ")
						.trim(),
				},
			})),
		};
		schemas.push(faqSchema);
	}

	return JSON.stringify(schemas, null, 2);
});

hexo.extend.helper.register("faqJsonld", function (page) {
	// Get FAQ data from the site data
	const allFaqs = this.site.data.faq || [];

	if (!allFaqs.length) return "";

	// --- Build FAQPage JSON-LD ---
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: allFaqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: this.strip_html(faq.answer.trim()).replace(/\s+/g, " "),
			},
		})),
	};

	return JSON.stringify(jsonLd, null, 2);
});
