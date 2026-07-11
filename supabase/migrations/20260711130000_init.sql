-- 中文 Claude Code 企業內訓 — Initial Schema
-- 2026-07-11 — Sprint 2 Day 1
-- 8 tables + RLS + indexes

-- ════════════════════════════════════════════════════════════════
-- 0. Extensions
-- ════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════════════════════════
-- 1. Users table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  name            TEXT,
  password_hash   TEXT,
  role            TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','instructor')),
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','basic','pro','enterprise','consulting')),
  email_verified   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ════════════════════════════════════════════════════════════════
-- 2. Courses table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  level         TEXT NOT NULL CHECK (level IN ('basic','advanced','enterprise')),
  price         INTEGER NOT NULL DEFAULT 0,
  duration      INTEGER NOT NULL DEFAULT 0, -- 課程總時長（分鐘）
  thumbnail     TEXT,
  published     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);

-- ════════════════════════════════════════════════════════════════
-- 3. Lessons table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  video_url   TEXT,
  duration    INTEGER NOT NULL DEFAULT 0, -- 影片長度（分鐘）
  "order"     INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);

-- ════════════════════════════════════════════════════════════════
-- 4. Exercises table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS exercises (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('multiple_choice','code','essay')),
  question    TEXT NOT NULL,
  options     JSONB,
  answer      TEXT NOT NULL,
  points      INTEGER NOT NULL DEFAULT 10,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

-- ════════════════════════════════════════════════════════════════
-- 5. Enrollments table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','expired')),
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  stripe_payment_id TEXT,
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- ════════════════════════════════════════════════════════════════
-- 6. Progress table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  watched         INTEGER NOT NULL DEFAULT 0, -- 已觀看秒數
  completed       BOOLEAN NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_enrollment_id ON progress(enrollment_id);

-- ════════════════════════════════════════════════════════════════
-- 7. Submissions table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id   UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answer        TEXT NOT NULL,
  score         INTEGER NOT NULL DEFAULT 0,
  feedback      TEXT,
  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_exercise_id ON submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);

-- ════════════════════════════════════════════════════════════════
-- 8. Bookings table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('enterprise','consulting')),
  scheduled_at  TIMESTAMPTZ NOT NULL,
  duration      INTEGER NOT NULL DEFAULT 60, -- 會議時長（分鐘）
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  attendees     INTEGER NOT NULL DEFAULT 1,
  price         INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);

-- ════════════════════════════════════════════════════════════════
-- 9. Certificates table
-- ════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL UNIQUE REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_url       TEXT,
  verify_code   TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', '')
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- ════════════════════════════════════════════════════════════════
-- 10. updated_at 自動維護
-- ════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users','courses']) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- ════════════════════════════════════════════════════════════════
-- 11. RLS（公開讀 + 寫入需登入）
-- ════════════════════════════════════════════════════════════════
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises     ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;

-- 全部公開讀
CREATE POLICY courses_read_all ON courses FOR SELECT USING (published = true);
CREATE POLICY lessons_read_all ON lessons FOR SELECT USING (true);
CREATE POLICY exercises_read_all ON exercises FOR SELECT USING (true);
CREATE POLICY certificates_verify ON certificates FOR SELECT USING (true);

-- users 自己讀
CREATE POLICY users_read_self ON users FOR SELECT USING (auth.uid()::text = id::text);

-- enrollments / progress / submissions / bookings 自己 CRUD
CREATE POLICY enrollments_self ON enrollments FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY progress_self ON progress FOR ALL USING (
  EXISTS (SELECT 1 FROM enrollments e WHERE e.id = enrollment_id AND e.user_id::text = auth.uid()::text)
);
CREATE POLICY submissions_self ON submissions FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY bookings_self ON bookings FOR ALL USING (auth.uid()::text = user_id::text);

-- 公開 INSERT（客人報名）
CREATE POLICY enrollments_public_insert ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY bookings_public_insert ON bookings FOR INSERT WITH CHECK (true);

-- service_role bypass（後端 API 用）
-- service_role 預設 bypass RLS，無需額外 policy

DO $$
BEGIN
  RAISE NOTICE '✅ Claude Code Training schema migration 完成';
  RAISE NOTICE '   - 9 tables (users / courses / lessons / exercises / enrollments / progress / submissions / bookings / certificates)';
  RAISE NOTICE '   - 11 RLS policies';
END $$;