create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'editor', 'admin');
create type public.content_status as enum ('draft', 'review', 'published', 'archived');
create type public.question_format as enum ('Y1', 'Y2', 'Y3');
create type public.cognitive_level as enum ('bilish', 'qollash', 'mulohaza');
create type public.report_status as enum ('yangi', 'korilmoqda', 'tuzatildi', 'rad');
create type public.exam_kind as enum ('diagnostika', 'mashq', 'mavzu', 'bolim', 'mock', 'takrorlash', 'zaif');
