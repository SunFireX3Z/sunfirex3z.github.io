interface ArticleSchemaProps {
    title: string;
    metaDescription: string;
    imageUrl: string;
    authorName: string;
    publishDate: string;
    lastUpdated: string | undefined;
    canonicalUrl: string;
    siteName: string;
    siteLogoUrl: string;
}

export function generateArticleSchema({
    title,
    metaDescription,
    imageUrl,
    authorName,
    publishDate,
    lastUpdated,
    canonicalUrl,
    siteName,
    siteLogoUrl,
}: ArticleSchemaProps) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: metaDescription,
        image: imageUrl,
        author: {
            "@type": "Person",
            name: authorName,
        },
        publisher: {
            "@type": "Organization",
            name: siteName,
            logo: {
                "@type": "ImageObject",
                url: siteLogoUrl,
            },
        },
        datePublished: new Date(publishDate).toISOString(),
        dateModified: new Date(lastUpdated ?? publishDate).toISOString(),
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
    };
}