create table public.post_stats (
    id bigint generated always as identity primary key,
    slug text not null unique,
    views integer not null default 0,
    likes integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);