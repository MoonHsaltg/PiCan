alter table public.profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.canvases enable row level security;
alter table public.canvas_items enable row level security;
alter table public.image_features enable row level security;
alter table public.image_check_results enable row level security;

create policy "Users manage their profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users manage their artworks"
on public.artworks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their canvases"
on public.canvases
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage items on their canvases"
on public.canvas_items
for all
using (
    exists (
        select 1
        from public.canvases
        where canvases.id = canvas_items.canvas_id
          and canvases.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.canvases
        where canvases.id = canvas_items.canvas_id
          and canvases.user_id = auth.uid()
    )
    and exists (
        select 1
        from public.artworks
        where artworks.id = canvas_items.artwork_id
          and artworks.user_id = auth.uid()
    )
);

create policy "Users manage features of their artworks"
on public.image_features
for all
using (
    exists (
        select 1
        from public.artworks
        where artworks.id = image_features.artwork_id
          and artworks.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.artworks
        where artworks.id = image_features.artwork_id
          and artworks.user_id = auth.uid()
    )
);

create policy "Users manage checks of their artworks"
on public.image_check_results
for all
using (
    exists (
        select 1
        from public.artworks
        where artworks.id = image_check_results.artwork_id
          and artworks.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.artworks
        where artworks.id = image_check_results.artwork_id
          and artworks.user_id = auth.uid()
    )
);

