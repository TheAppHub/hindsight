hexo.extend.helper.register("getFlatCategories", function () {
	// Get all work posts
	const workPosts = this.site.posts.filter((post) => post.layout === "work");

	// Collect all unique categories from work posts
	const categorySet = new Set();
	workPosts.forEach((post) => {
		if (post.categories && post.categories.length) {
			post.categories.forEach((category) => {
				categorySet.add(category.name);
			});
		}
	});

	// Convert to array and sort
	return Array.from(categorySet).sort();
});

hexo.extend.helper.register("getCategoryUrl", function (categoryName) {
	// Convert category name to URL-friendly format
	const urlName = categoryName
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/&/g, "and")
		.replace(/\+/g, "plus");

	return `/portfolio/${urlName}/`;
});

hexo.extend.helper.register("getWorkPostsByCategory", function (categoryName) {
	// Get all work posts that have this category
	const workPosts = this.site.posts.filter(
		(post) =>
			post.layout === "work" &&
			post.categories &&
			post.categories.some((cat) => cat.name === categoryName),
	);

	return workPosts.sort("-date");
});
