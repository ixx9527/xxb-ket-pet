-- ===========================================
-- 星星榜 KET/PET 学习平台 - 数据库初始化脚本
-- ===========================================

-- 用户表（学生信息）
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    grade INTEGER DEFAULT 3,
    avatar_url VARCHAR(255),
    parent_phone VARCHAR(20),
    parent_wechat VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户账号表（登录用）
CREATE TABLE IF NOT EXISTS user_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 题目表（KET/PET 真题）
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL, -- KET/PET
    part VARCHAR(50) NOT NULL, -- 部分，如 Reading Part 1
    question_type VARCHAR(20) NOT NULL, -- single_choice, multiple_choice, fill_blank, matching
    content TEXT NOT NULL, -- 题目内容（支持 HTML）
    options JSONB NOT NULL, -- 选项 [{key: "A", text: "...", image_url: "..."}]
    answer VARCHAR(255) NOT NULL, -- 正确答案
    explanation TEXT, -- 解析
    difficulty INTEGER DEFAULT 1, -- 1-5 难度
    source VARCHAR(50), -- 来源，如 2023 年真题
    tags JSONB DEFAULT '[]', -- 标签 ["词汇", "语法", "阅读"]
    audio_url VARCHAR(255), -- 听力音频 URL
    image_url VARCHAR(255), -- 题目图片 URL
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 每日练习记录
CREATE TABLE IF NOT EXISTS daily_practice (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    practice_date DATE NOT NULL,
    category VARCHAR(20) NOT NULL, -- KET/PET
    score INTEGER DEFAULT 0, -- 得分
    total_questions INTEGER DEFAULT 0, -- 总题数
    correct_count INTEGER DEFAULT 0, -- 正确数
    time_spent INTEGER DEFAULT 0, -- 用时（秒）
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, practice_date, category)
);

-- 答题记录（详细记录每道题）
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    daily_practice_id INTEGER REFERENCES daily_practice(id) ON DELETE CASCADE,
    selected_answer VARCHAR(255) NOT NULL, -- 用户选择的答案
    is_correct BOOLEAN NOT NULL, -- 是否正确
    time_spent INTEGER DEFAULT 0, -- 该题用时（秒）
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 错题本
CREATE TABLE IF NOT EXISTS mistakes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    wrong_count INTEGER DEFAULT 1, -- 错误次数
    last_wrong_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mastered BOOLEAN DEFAULT FALSE, -- 是否已掌握
    mastered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- 成长记录（积分/等级）
CREATE TABLE IF NOT EXISTS growth (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    points INTEGER DEFAULT 0, -- 总积分
    level INTEGER DEFAULT 1, -- 等级
    level_name VARCHAR(50) DEFAULT '英语小苗',
    badges JSONB DEFAULT '[]', -- 勋章列表 [{id: "badge_001", name: "...", earned_at: "..."}]
    streak_days INTEGER DEFAULT 0, -- 连续打卡天数
    longest_streak INTEGER DEFAULT 0, -- 最长连续天数
    total_practice_days INTEGER DEFAULT 0, -- 总练习天数
    total_questions INTEGER DEFAULT 0, -- 总答题数
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 打卡日历（记录每天是否打卡）
CREATE TABLE IF NOT EXISTS checkin_calendar (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    category VARCHAR(20) NOT NULL,
    points_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checkin_date, category)
);

-- 等级配置表
CREATE TABLE IF NOT EXISTS level_config (
    id SERIAL PRIMARY KEY,
    level INTEGER UNIQUE NOT NULL,
    level_name VARCHAR(50) NOT NULL,
    min_points INTEGER NOT NULL,
    icon_url VARCHAR(255),
    description TEXT
);

-- 勋章配置表
CREATE TABLE IF NOT EXISTS badge_config (
    id SERIAL PRIMARY KEY,
    badge_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    condition_type VARCHAR(50) NOT NULL, -- streak_days, total_questions, perfect_score, etc.
    condition_value INTEGER NOT NULL,
    points_reward INTEGER DEFAULT 0
);

-- 学习报告（周报/月报）
CREATE TABLE IF NOT EXISTS learning_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(20) NOT NULL, -- weekly, monthly
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_practice_days INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_rate DECIMAL(5,2) DEFAULT 0, -- 正确率
    weak_points JSONB DEFAULT '[]', -- 薄弱点
    improvement_suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- 初始化数据
-- ===========================================

-- 等级配置
INSERT INTO level_config (level, level_name, min_points, description) VALUES
(1, '英语小苗', 0, '开始你的英语学习之旅'),
(2, '英语新芽', 100, '继续加油，已经入门啦'),
(3, '英语小树', 300, '稳步成长，越来越棒'),
(4, '英语大树', 600, '知识茂盛，值得骄傲'),
(5, '英语之星', 1000, '闪闪发光的小明星'),
(6, '英语学霸', 1500, '学习的榜样'),
(7, '英语大师', 2000, '接近完美的水平');

-- 勋章配置
INSERT INTO badge_config (badge_id, name, description, condition_type, condition_value, points_reward) VALUES
('badge_001', '坚持小能手', '连续打卡 7 天', 'streak_days', 7, 20),
('badge_002', '毅力之星', '连续打卡 30 天', 'streak_days', 30, 100),
('badge_003', '刷题达人', '完成 100 道题', 'total_questions', 100, 50),
('badge_004', '完美之星', '单次练习全对', 'perfect_score', 1, 30),
('badge_005', '逆袭王者', '错题全部掌握', 'mistakes_mastered', 10, 100),
('badge_006', '早起鸟儿', '连续 7 天早上练习', 'morning_checkin', 7, 50),
('badge_007', 'KET 先锋', '完成 KET 全部真题', 'ket_complete', 1, 200),
('badge_008', 'PET 挑战者', '完成 PET 全部真题', 'pet_complete', 1, 200);

-- ===========================================
-- 创建索引
-- ===========================================

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_user_accounts_username ON user_accounts(username);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_daily_practice_user ON daily_practice(user_id);
CREATE INDEX idx_daily_practice_date ON daily_practice(practice_date);
CREATE INDEX idx_answers_user ON answers(user_id);
CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_mistakes_user ON mistakes(user_id);
CREATE INDEX idx_mistakes_mastered ON mistakes(mastered);
CREATE INDEX idx_checkin_user ON checkin_calendar(user_id);
CREATE INDEX idx_checkin_date ON checkin_calendar(checkin_date);
CREATE INDEX idx_reports_user ON learning_reports(user_id);
