/* eslint-disable react/prop-types */

function Youtube({
    id,
    title = "YouTube Video",
    caption,
    className = "",
}) {
    return (
        <figure className="not-prose my-8 flex flex-col items-center">
      <div
        className={`aspect-video w-full overflow-hidden rounded-xl shadow-md ${className}`}
      >
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
    );
}

export default Youtube;