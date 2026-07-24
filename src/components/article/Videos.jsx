import React, { useEffect, useState } from "react";
import { getLatestVideos } from "../../api/youtube";

/**
 * [DEPRECATED]
 * Komponen ini tidak lagi digunakan karena fitur video telah dihentikan.
 */
function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const items = await getLatestVideos();
                if (items) {
                    setVideos(items);
                } else {
                    setError("Format respons API tidak terduga.");
                }
            } catch (err) {
                console.error("Gagal mengambil video:", err);
                setError("Gagal memuat video. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Skeleton Loader */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse space-y-4">
                        <div className="bg-gray-200 aspect-video rounded-lg"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
                <a
                    key={video.id.videoId}
                    href={`/videos/${video.id.videoId}`}
                    className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    <div className="relative">
                        <img
                            src={video.snippet.thumbnails.high.url}
                            alt={video.snippet.title}
                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white/80">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.288L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-base font-bold text-gray-800 line-clamp-2 group-hover:text-orange-500">{video.snippet.title}</h3>
                        <p className="mt-2 text-xs text-gray-500">{new Date(video.snippet.publishTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

export default Videos;