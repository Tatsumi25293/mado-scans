-- ==============================================================
-- MADO Scans - Supabase Database & Storage Setup
-- ==============================================================

-- 1. Create Public Storage Bucket for Images (Covers, Banners, Chapter Pages)
insert into storage.buckets (id, name, public)
values ('mado-media', 'mado-media', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access to MADO Media"
on storage.objects for select
using ( bucket_id = 'mado-media' );

create policy "Allow Upload to MADO Media"
on storage.objects for insert
with check ( bucket_id = 'mado-media' );

create policy "Allow Update to MADO Media"
on storage.objects for update
using ( bucket_id = 'mado-media' );

create policy "Allow Delete from MADO Media"
on storage.objects for delete
using ( bucket_id = 'mado-media' );

-- 2. Manhwas Table
create table if not exists public.manhwas (
  id text primary key,
  title text not null,
  arabic_title text not null,
  author text default '',
  artist text default '',
  cover text not null,
  banner text default '',
  synopsis text default '',
  genres text[] default array['Action'],
  status text default 'مستمر',
  rating numeric default 4.9,
  views text default '100K',
  is_trending boolean default false,
  is_featured boolean default false,
  chapters_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Chapters Table
create table if not exists public.chapters (
  id text primary key,
  manhwa_id text references public.manhwas(id) on delete cascade,
  number numeric not null,
  title text default '',
  date text default 'الآن',
  views text default '1K',
  is_locked boolean default false,
  pages text[] default array[]::text[],
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.manhwas enable row level security;
alter table public.chapters enable row level security;

-- Public Read Policies (All readers can view manhwas & chapters)
create policy "Allow public read manhwas"
on public.manhwas for select
using (true);

create policy "Allow public read chapters"
on public.chapters for select
using (true);

-- Admin Insert / Update / Delete Policies
create policy "Allow manage manhwas"
on public.manhwas for all
using (true);

create policy "Allow manage chapters"
on public.chapters for all
using (true);
