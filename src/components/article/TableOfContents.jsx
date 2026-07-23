/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function TableOfContents({ items }) {
    const [activeTocSlug, setActiveTocSlug] = useState("");
    const [isTocCollapsed, setIsTocCollapsed] = useState(false);
    const [activeTocGroup, setActiveTocGroup] = useState(null);

    useEffect(() => {
        if (items.length === 0) return;

        const flatToc = items.flatMap((h2) => [h2, ...h2.children]);

        const handleScroll = () => {
            const fromTop = 200;
            let currentActiveSlug = "";

            for (const item of flatToc) {
                const element = document.getElementById(item.slug);

                if (element && element.getBoundingClientRect().top < fromTop) {
                    currentActiveSlug = item.slug;
                } else {
                    break;
                }
            }

            setActiveTocSlug(currentActiveSlug);

            if (currentActiveSlug) {
                const parentGroup = items.find(
                    (h2) =>
                        h2.slug === currentActiveSlug ||
                        h2.children.some((h3) => h3.slug === currentActiveSlug)
                );

                if (parentGroup) {
                    setActiveTocGroup(parentGroup.slug);
                }
            } else {
                setActiveTocGroup(null);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    const handleToggleGroup = (groupSlug) => {
        setActiveTocGroup((prevGroup) =>
            prevGroup === groupSlug ? null : groupSlug
        );
    };

    const totalTocItems = items.reduce(
        (acc, h2) => acc + 1 + h2.children.length,
        0
    );

    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Daftar Isi</h3>

                <button
                    onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                    className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                    aria-label={
                        isTocCollapsed
                            ? "Buka daftar isi"
                            : "Tutup daftar isi"
                    }
                    aria-expanded={!isTocCollapsed}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`h-5 w-5 transition-transform duration-300 ${
                            !isTocCollapsed ? "rotate-180" : ""
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                </button>
            </div>

            <div
                className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
                    isTocCollapsed
                        ? "grid-rows-[0fr] opacity-0"
                        : "grid-rows-[1fr] opacity-100"
                }`}
            >
                <div className="overflow-hidden">
                    <ul
                        className={`space-y-1 border-t border-gray-200 pt-4 ${
                            totalTocItems > 10
                                ? "custom-scrollbar max-h-96 overflow-y-auto pr-2"
                                : ""
                        }`}
                    >
                        {items.map((h2Item) => {
                            const isGroupExpanded =
                                activeTocGroup === h2Item.slug;
                            const hasChildren = h2Item.children.length > 0;
                            const isH2Active =
                                activeTocSlug === h2Item.slug;

                            return (
                                <li key={h2Item.slug}>
                                    <div className="flex items-center justify-between">
                                        <a
                                            href={`#${h2Item.slug}`}
                                            className={`flex flex-1 items-center gap-2 border-l-4 py-1 pl-3 text-sm transition-all duration-200 ${
                                                isH2Active
                                                    ? "border-orange-500 font-semibold text-orange-600"
                                                    : "border-transparent text-gray-600 hover:border-orange-200 hover:text-orange-500"
                                            }`}
                                        >
                                            {/* Ikon H2 */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="h-4 w-4 flex-shrink-0 text-orange-400"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.25 6.75v12l-5.25-3-5.25 3v-12A2.25 2.25 0 019 4.5h6a2.25 2.25 0 012.25 2.25Z"
                                                />
                                            </svg>

                                            <span>{h2Item.text}</span>
                                        </a>

                                        {hasChildren && (
                                            <button
                                                onClick={() =>
                                                    handleToggleGroup(
                                                        h2Item.slug
                                                    )
                                                }
                                                className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className={`h-5 w-5 transition-transform duration-300 ${
                                                        isGroupExpanded
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {hasChildren && (
                                        <div
                                            className={`grid overflow-hidden pl-2 transition-all duration-300 ease-in-out ${
                                                isGroupExpanded
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0"
                                            }`}
                                        >
                                            <ul className="space-y-2 overflow-hidden pt-2 pl-2">
                                                {h2Item.children.map(
                                                    (h3Item) => (
                                                        <li
                                                            key={h3Item.slug}
                                                        >
                                                            <a
                                                                href={`#${h3Item.slug}`}
                                                                className={`flex items-center gap-2 border-l-4 py-1 pl-3 text-sm transition-all duration-200 ${
                                                                    activeTocSlug ===
                                                                    h3Item.slug
                                                                        ? "border-sky-500 font-semibold text-sky-600"
                                                                        : "border-transparent text-gray-500 hover:border-sky-200 hover:text-sky-500"
                                                                }`}
                                                            >
                                                                {/* Ikon H3 */}
                                                                <span className="h-2 w-2 rounded-full bg-sky-400" />

                                                                <span>
                                                                    {
                                                                        h3Item.text
                                                                    }
                                                                </span>
                                                            </a>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TableOfContents;