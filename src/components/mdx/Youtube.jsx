function Youtube({ id }) {
    return (
        <div className="not-prose my-8 aspect-video overflow-hidden rounded-xl">
            <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube Video Player"
                allowFullScreen
            />
        </div>
    )
}

export default Youtube;