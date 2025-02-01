from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    priority = 0.0
    changefreq = "weekly"

    def items(self):
        """List of static views to include in sitemap."""
        return ["home", "dashboard", "policy"]

    def location(self, item):
        """Return the URL for each static view."""
        return reverse(item)  # Resolves named URL patterns
