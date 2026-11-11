-- reports: user submitted problem reports plus seeded Open311 records.
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  body text not null check (char_length(body) between 3 and 1000),
  photo_url text,
  address text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  source text not null default 'user' check (source in ('user', 'open311')),
  external_id text unique,
  created_at timestamptz not null default now()
);

create index reports_created_at_idx on public.reports (created_at desc);

alter table public.reports enable row level security;

create policy "Everyone can read reports"
  on public.reports for select
  to anon, authenticated
  using (true);

-- Anonymous sign-ins use the authenticated role, so guests can insert too.
create policy "Users insert their own reports"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = user_id and source = 'user');
