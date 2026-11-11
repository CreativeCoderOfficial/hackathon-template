create table public.example_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  created_at timestamptz not null default now()
);

create index example_items_created_at_idx on public.example_items (created_at desc);

alter table public.example_items enable row level security;

create policy "Everyone can read items"
  on public.example_items for select
  to anon, authenticated
  using (true);

-- Anonymous sign-ins use the authenticated role, so guests can insert too.
create policy "Users insert their own items"
  on public.example_items for insert
  to authenticated
  with check (auth.uid() = user_id);
