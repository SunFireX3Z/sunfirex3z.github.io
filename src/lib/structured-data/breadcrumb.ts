interface BreadcrumbItem {
    name: string;
    url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
    if (items.length === 0) {
        return null;
    }

    const itemListElement = items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    }));

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
    };
}