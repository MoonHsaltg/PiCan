create extension if not exists pgcrypto;
create extension if not exists vector;

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name varchar(100) not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.artworks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    title varchar(200) not null,
    image_url text not null,
    thumbnail_url text,
    image_width integer not null check (image_width > 0),
    image_height integer not null check (image_height > 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.canvases (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name varchar(150) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.canvas_items (
    id uuid primary key default gen_random_uuid(),
    canvas_id uuid not null references public.canvases(id) on delete cascade,
    artwork_id uuid not null references public.artworks(id) on delete cascade,
    x_position numeric not null default 0,
    y_position numeric not null default 0,
    item_width numeric not null check (item_width > 0),
    item_height numeric not null check (item_height > 0),
    rotation numeric not null default 0,
    z_index integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.image_features (
    id uuid primary key default gen_random_uuid(),
    artwork_id uuid not null references public.artworks(id) on delete cascade,
    model_version varchar(50) not null,
    embedding vector(1536),
    dominant_color_hex char(7),
    brightness_score numeric(5, 4)
        check (brightness_score between 0 and 1),
    contrast_score numeric(5, 4)
        check (contrast_score between 0 and 1),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (artwork_id, model_version)
);

create table public.image_check_results (
    id uuid primary key default gen_random_uuid(),
    artwork_id uuid not null references public.artworks(id) on delete cascade,
    model_version varchar(50) not null,
    status varchar(20) not null
        check (status in ('pending', 'passed', 'failed', 'error')),
    score numeric(5, 4) check (score between 0 and 1),
    message text,
    checked_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index artworks_user_id_idx on public.artworks(user_id);
create index canvases_user_id_idx on public.canvases(user_id);
create index canvas_items_canvas_id_idx on public.canvas_items(canvas_id);
create index canvas_items_artwork_id_idx on public.canvas_items(artwork_id);
create index image_features_artwork_id_idx on public.image_features(artwork_id);
create index image_check_results_artwork_id_idx
    on public.image_check_results(artwork_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger artworks_set_updated_at
before update on public.artworks
for each row execute function public.set_updated_at();

create trigger canvases_set_updated_at
before update on public.canvases
for each row execute function public.set_updated_at();

create trigger canvas_items_set_updated_at
before update on public.canvas_items
for each row execute function public.set_updated_at();

create trigger image_features_set_updated_at
before update on public.image_features
for each row execute function public.set_updated_at();

create trigger image_check_results_set_updated_at
before update on public.image_check_results
for each row execute function public.set_updated_at();

