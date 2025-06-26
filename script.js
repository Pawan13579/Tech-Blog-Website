async function fetchNews(category = 'All') {
  const gnewsApiKey = "3179d328ac2f67d61ecd6d3f98fa6640";
  const newsApiKey = "2ae092974d5342fcae9dad2da734a6c0";

  // Map UI category to API topic/category
  const gnewsTopic = {
    All: "technology",
    AI: "science",
    Gadgets: "technology",
    Robotics: "science"
  }[category] || "technology";

  const newsapiCategory = {
    All: "technology",
    AI: "science",
    Gadgets: "technology",
    Robotics: "science"
  }[category] || "technology";

  const gnewsEndpoint = `https://gnews.io/api/v4/top-headlines?topic=${gnewsTopic}&lang=en&max=5&apikey=${gnewsApiKey}`;
  const newsApiEndpoint = `https://newsapi.org/v2/top-headlines?category=${newsapiCategory}&language=en&pageSize=5&apiKey=${newsApiKey}`;

  const container = document.getElementById("blog-grid");
  container.innerHTML = '';

  try {
    const [gnewsRes, newsapiRes] = await Promise.all([
      fetch(gnewsEndpoint),
      fetch(newsApiEndpoint)
    ]);

    const [gnewsData, newsapiData] = await Promise.all([
      gnewsRes.json(),
      newsapiRes.json()
    ]);

    const gnewsArticles = gnewsData.articles || [];
    const newsapiArticles = newsapiData.articles || [];

    const allArticles = [...gnewsArticles, ...newsapiArticles];

    if (!allArticles.length) {
      container.innerHTML = `<p style="color:red;">No news articles found.</p>`;
      return;
    }

    allArticles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'blog-card';

      const imageUrl = article.image || article.urlToImage || 'default.jpg';
      const title = article.title || 'Untitled';
      const description = article.description || article.content || 'No description available.';
      const url = article.url || '#';

      card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" onerror="this.src='default.jpg'" />
        <h3>${title}</h3>
        <p>${description}</p>
        <a href="${url}" target="_blank">Read More</a>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Fetch failed:", error.message);
    container.innerHTML = `<p style="color:red;">⚠️ Failed to load news.</p>`;
  }
}
// Setup category buttons to call fetchNews
document.addEventListener("DOMContentLoaded", () => {
  fetchNews("All"); // Load default news

  const buttons = document.querySelectorAll('.category-btn');

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-category");

      // update active button styling
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      fetchNews(selected); // Fetch news based on selected category
    });
  });
});
