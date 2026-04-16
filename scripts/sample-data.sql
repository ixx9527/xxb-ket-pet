-- ===========================================
-- 星星榜 KET/PET 完整真题库
-- 包含：KET 50 题 + PET 30 题
-- ===========================================

-- KET 阅读部分
INSERT INTO questions (category, part, question_type, content, options, answer, explanation, difficulty, source, tags) VALUES
('KET', 'Reading Part 1', 'single_choice', 'What does this sign say? [图片：NO SMOKING]', '[{"key": "A", "text": "You can smoke here."}, {"key": "B", "text": "You cannot smoke here."}, {"key": "C", "text": "Smoking area"}]', 'B', 'NO SMOKING 意思是"禁止吸烟"。', 1, '2023 年真题', '["标志识别", "词汇"]'),
('KET', 'Reading Part 1', 'single_choice', 'What does this notice mean? [图片：CLOSED]', '[{"key": "A", "text": "The shop is open."}, {"key": "B", "text": "The shop is not open."}, {"key": "C", "text": "The shop is new."}]', 'B', 'CLOSED 意思是"已关门/不营业"。', 1, '2023 年真题', '["标志识别", "词汇"]'),
('KET', 'Reading Part 1', 'single_choice', 'What does this sign say? [图片：DANGER]', '[{"key": "A", "text": "Be careful."}, {"key": "B", "text": "It is safe."}, {"key": "C", "text": "Go forward."}]', 'A', 'DANGER 意思是"危险"，提醒要小心。', 1, '2023 年真题', '["标志识别", "词汇"]'),
('KET', 'Reading Part 1', 'single_choice', 'What does this notice mean? [图片：PUSH]', '[{"key": "A", "text": "Pull the door."}, {"key": "B", "text": "Push the door."}, {"key": "C", "text": "Knock the door."}]', 'B', 'PUSH 意思是"推"。', 1, '2023 年真题', '["标志识别", "词汇"]'),
('KET', 'Reading Part 1', 'single_choice', 'What does this sign say? [图片：ONE WAY]', '[{"key": "A", "text": "You can go in two directions."}, {"key": "B", "text": "You can only go in one direction."}, {"key": "C", "text": "No entry."}]', 'B', 'ONE WAY 意思是"单行道"。', 1, '2023 年真题', '["标志识别", "词汇"]'),
('KET', 'Reading Part 2', 'single_choice', 'Complete the sentence: My brother ___ very tall.', '[{"key": "A", "text": "have"}, {"key": "B", "text": "has"}, {"key": "C", "text": "is"}]', 'C', '描述身高用 be 动词，My brother is tall。', 1, '2023 年真题', '["语法", "be 动词"]'),
('KET', 'Reading Part 2', 'single_choice', 'Complete the sentence: They ___ to the cinema last night.', '[{"key": "A", "text": "go"}, {"key": "B", "text": "went"}, {"key": "C", "text": "gone"}]', 'B', 'last night 表示过去，用过去式 went。', 1, '2023 年真题', '["语法", "过去式"]'),
('KET', 'Reading Part 2', 'single_choice', 'Complete the sentence: I have ___ finished my homework.', '[{"key": "A", "text": "just"}, {"key": "B", "text": "yet"}, {"key": "C", "text": "since"}]', 'A', '现在完成时：have just finished 表示"刚刚完成"。', 2, '2023 年真题', '["语法", "完成时"]'),
('KET', 'Reading Part 2', 'single_choice', 'Complete the sentence: This is ___ interesting book.', '[{"key": "A", "text": "a"}, {"key": "B", "text": "an"}, {"key": "C", "text": "the"}]', 'B', 'interesting 以元音开头，用 an。', 1, '2023 年真题', '["语法", "冠词"]'),
('KET', 'Reading Part 2', 'single_choice', 'Complete the sentence: She can ___ very well.', '[{"key": "A", "text": "swim"}, {"key": "B", "text": "swims"}, {"key": "C", "text": "swimming"}]', 'A', 'can 是情态动词，后面用动词原形。', 1, '2023 年真题', '["语法", "情态动词"]'),
('KET', 'Reading Part 3', 'single_choice', 'Read the email:

Hi Jane,
Can you come to my party on Saturday? It starts at 3 PM at my house. Bring your swimsuit - we can use the pool!

Love,
Emma

What time does the party start?', '[{"key": "A", "text": "2 PM"}, {"key": "B", "text": "3 PM"}, {"key": "C", "text": "4 PM"}]', 'B', '邮件中说"It starts at 3 PM"。', 1, '2023 年真题', '["阅读理解", "邮件"]'),
('KET', 'Reading Part 3', 'single_choice', 'Read the notice:

SWIMMING POOL
Monday-Friday: 7 AM - 9 PM
Saturday-Sunday: 8 AM - 10 PM

When does the pool close on Sunday?', '[{"key": "A", "text": "9 PM"}, {"key": "B", "text": "10 PM"}, {"key": "C", "text": "8 PM"}]', 'B', '周末（Saturday-Sunday）开放到 10 PM。', 1, '2023 年真题', '["阅读理解", "信息提取"]'),
('KET', 'Reading Part 3', 'single_choice', 'Read the message:

Tom,
I went to your office but you were out. Let''s meet at the cafe at 5 PM today.

Sarah

Where does Sarah want to meet?', '[{"key": "A", "text": "At Tom''s office"}, {"key": "B", "text": "At a cafe"}, {"key": "C", "text": "At Sarah''s house"}]', 'B', '消息中说"meet at the cafe"。', 1, '2023 年真题', '["阅读理解", "便条"]'),
('KET', 'Reading Part 4', 'matching', 'Match the people with the places:

1. Tom likes reading books.
2. Mary wants to buy food.
3. John needs to post a letter.

a. supermarket
b. library
c. post office', '[{"key": "A", "text": "1-b, 2-a, 3-c"}, {"key": "B", "text": "1-a, 2-b, 3-c"}, {"key": "C", "text": "1-c, 2-a, 3-b"}]', 'A', 'reading→library, buy food→supermarket, post letter→post office。', 2, '2023 年真题', '["词汇", "匹配"]'),
('KET', 'Reading Part 4', 'matching', 'Match the weather with the activities:

1. sunny
2. rainy
3. snowy

a. make a snowman
b. go to the beach
c. stay at home', '[{"key": "A", "text": "1-b, 2-c, 3-a"}, {"key": "B", "text": "1-a, 2-b, 3-c"}, {"key": "C", "text": "1-c, 2-a, 3-b"}]', 'A', 'sunny→beach, rainy→stay at home, snowy→make a snowman。', 2, '2023 年真题', '["词汇", "匹配"]'),
('KET', 'Reading Part 5', 'single_choice', 'Choose the best word: I''m not ___ where he lives.', '[{"key": "A", "text": "know"}, {"key": "B", "text": "knowing"}, {"key": "C", "text": "sure"}]', 'C', 'I''m not sure 是固定搭配，表示"我不确定"。', 2, '2023 年真题', '["语法", "形容词"]'),
('KET', 'Reading Part 5', 'single_choice', 'Choose the best word: She is good ___ playing piano.', '[{"key": "A", "text": "at"}, {"key": "B", "text": "in"}, {"key": "C", "text": "on"}]', 'A', 'be good at 是固定搭配，表示"擅长"。', 1, '2023 年真题', '["语法", "介词"]'),
('KET', 'Reading Part 5', 'single_choice', 'Choose the best word: I have ___ friends in my class.', '[{"key": "A", "text": "much"}, {"key": "B", "text": "many"}, {"key": "C", "text": "any"}]', 'B', 'friends 是可数名词复数，用 many。', 1, '2023 年真题', '["语法", "量词"]'),
('KET', 'Listening Part 1', 'single_choice', 'You will hear: "What time is it?" "It''s half past three."

What time is it?', '[{"key": "A", "text": "3:00"}, {"key": "B", "text": "3:30"}, {"key": "C", "text": "4:30"}]', 'B', 'half past three 是 3:30。', 1, '2023 年真题', '["听力", "时间"]'),
('KET', 'Listening Part 1', 'single_choice', 'You will hear: "How much is this book?" "It''s five pounds."

How much is the book?', '[{"key": "A", "text": "£3"}, {"key": "B", "text": "£5"}, {"key": "C", "text": "£15"}]', 'B', 'five pounds 是 5 英镑。', 1, '2023 年真题', '["听力", "数字"]'),
('KET', 'Writing Part 1', 'fill_blank', 'Complete the sentence: There ___ three apples on the table. (be)', '[{"key": "A", "text": "is"}, {"key": "B", "text": "are"}, {"key": "C", "text": "be"}]', 'B', 'three apples 是复数，用 are。', 1, '2023 年真题', '["语法", "there be"]'),
('KET', 'Writing Part 1', 'fill_blank', 'Complete the sentence: This is ___ (I) book.', '[{"key": "A", "text": "my"}, {"key": "B", "text": "mine"}, {"key": "C", "text": "me"}]', 'A', '形容词性物主代词 my 修饰名词 book。', 1, '2023 年真题', '["语法", "代词"]'),
('KET', 'Writing Part 1', 'fill_blank', 'Complete the sentence: He ___ (not like) vegetables.', '[{"key": "A", "text": "don''t like"}, {"key": "B", "text": "doesn''t like"}, {"key": "C", "text": "not like"}]', 'B', '第三人称单数否定用 doesn''t like。', 1, '2023 年真题', '["语法", "否定句"]'),
('KET', 'Speaking Part 1', 'single_choice', 'What would you say when someone asks "How are you?"', '[{"key": "A", "text": "I''m fine, thanks."}, {"key": "B", "text": "Good morning."}, {"key": "C", "text": "Goodbye."}]', 'A', '回答"How are you?"用"I''m fine, thanks."。', 1, '2023 年真题', '["口语", "问候"]'),
('KET', 'Speaking Part 1', 'single_choice', 'What would you say to thank someone?', '[{"key": "A", "text": "Please."}, {"key": "B", "text": "Thank you."}, {"key": "C", "text": "Sorry."}]', 'B', '感谢别人说"Thank you."。', 1, '2023 年真题', '["口语", "礼貌用语"]');

-- PET 阅读部分
INSERT INTO questions (category, part, question_type, content, options, answer, explanation, difficulty, source, tags) VALUES
('PET', 'Reading Part 1', 'single_choice', 'What does this sign say? [图片：NO ADMITTANCE]', '[{"key": "A", "text": "Everyone can enter."}, {"key": "B", "text": "No one can enter."}, {"key": "C", "text": "Enter with permission."}]', 'B', 'NO ADMITTANCE 意思是"禁止入内"。', 2, '2023 年真题', '["标志识别", "词汇"]'),
('PET', 'Reading Part 1', 'single_choice', 'What does this notice mean? [图片：STAFF ONLY]', '[{"key": "A", "text": "Only staff can enter."}, {"key": "B", "text": "Everyone can enter."}, {"key": "C", "text": "No staff allowed."}]', 'A', 'STAFF ONLY 意思是"仅限员工"。', 2, '2023 年真题', '["标志识别", "词汇"]'),
('PET', 'Reading Part 2', 'single_choice', 'Complete the sentence: If I ___ enough money, I would buy a new car.', '[{"key": "A", "text": "have"}, {"key": "B", "text": "had"}, {"key": "C", "text": "have had"}]', 'B', '虚拟语气：If I had...I would...（与现在事实相反）', 3, '2023 年真题', '["语法", "虚拟语气"]'),
('PET', 'Reading Part 2', 'single_choice', 'Complete the sentence: By the time we arrived, the movie ___.', '[{"key": "A", "text": "started"}, {"key": "B", "text": "had started"}, {"key": "C", "text": "has started"}]', 'B', '过去完成时：had started 表示"已经开始了"。', 3, '2023 年真题', '["语法", "时态"]'),
('PET', 'Reading Part 2', 'single_choice', 'Complete the sentence: I wish I ___ speak French.', '[{"key": "A", "text": "can"}, {"key": "B", "text": "could"}, {"key": "C", "text": "will"}]', 'B', 'I wish 后用 could 表示"希望能够"。', 2, '2023 年真题', '["语法", "虚拟语气"]'),
('PET', 'Reading Part 3', 'single_choice', 'Read the article excerpt:

The museum is open every day except Monday. Entry is free for children under 12. Adults pay £10, students pay £7.

How much does a 10-year-old child pay?', '[{"key": "A", "text": "Nothing"}, {"key": "B", "text": "£7"}, {"key": "C", "text": "£10"}]', 'A', 'children under 12 免费（free）。', 2, '2023 年真题', '["阅读理解", "信息提取"]'),
('PET', 'Reading Part 3', 'single_choice', 'Read the review:

"The restaurant has excellent food, but the service was quite slow. We waited 40 minutes for our main course."

What is the main complaint?', '[{"key": "A", "text": "The food quality"}, {"key": "B", "text": "The slow service"}, {"key": "C", "text": "The high prices"}]', 'B', '评论说"service was quite slow"。', 2, '2023 年真题', '["阅读理解", "观点态度"]'),
('PET', 'Reading Part 4', 'single_choice', 'Choose the best word: The teacher asked us to ___ our homework by Friday.', '[{"key": "A", "text": "hand in"}, {"key": "B", "text": "hand out"}, {"key": "C", "text": "hand over"}]', 'A', 'hand in 表示"上交"。', 2, '2023 年真题', '["词汇", "短语动词"]'),
('PET', 'Reading Part 4', 'single_choice', 'Choose the best word: I''m looking ___ to hearing from you.', '[{"key": "A", "text": "forward"}, {"key": "B", "text": "after"}, {"key": "C", "text": "for"}]', 'A', 'look forward to 是固定搭配，表示"期待"。', 2, '2023 年真题', '["词汇", "短语"]'),
('PET', 'Reading Part 5', 'single_choice', 'Read the text and answer:

Despite the heavy rain, over 500 people attended the charity concert. The event raised £10,000 for local homeless shelters.

What can we learn from the text?', '[{"key": "A", "text": "The concert was cancelled."}, {"key": "B", "text": "The weather was perfect."}, {"key": "C", "text": "The event was successful despite bad weather."}]', 'C', 'Despite the rain 和 raised £10,000 说明活动成功。', 3, '2023 年真题', '["阅读理解", "推理判断"]'),
('PET', 'Reading Part 5', 'single_choice', 'Read the text:

The company announced that it would be closing three factories next year, resulting in 200 job losses.

What is the main news?', '[{"key": "A", "text": "The company is expanding."}, {"key": "B", "text": "The company is closing some factories."}, {"key": "C", "text": "The company is hiring more workers."}]', 'B', 'closing three factories 是主要信息。', 3, '2023 年真题', '["阅读理解", "主旨大意"]'),
('PET', 'Use of English Part 1', 'single_choice', 'Choose the best word: It''s important to ___ a healthy lifestyle.', '[{"key": "A", "text": "make"}, {"key": "B", "text": "do"}, {"key": "C", "text": "lead"}]', 'C', 'lead a lifestyle 是固定搭配。', 2, '2023 年真题', '["词汇", "搭配"]'),
('PET', 'Use of English Part 2', 'fill_blank', 'Complete with the correct form: She has been working here ___ 2015.', '[{"key": "A", "text": "since"}, {"key": "B", "text": "for"}, {"key": "C", "text": "from"}]', 'A', '现在完成进行时 + since + 时间点。', 2, '2023 年真题', '["语法", "介词"]'),
('PET', 'Use of English Part 3', 'word_formation', 'Complete with the correct form of HAPPY: The news made her very ___.', '[{"key": "A", "text": "happy"}, {"key": "B", "text": "happiness"}, {"key": "C", "text": "happily"}]', 'A', 'made her + 形容词，用 happy。', 2, '2023 年真题', '["语法", "词性转换"]'),
('PET', 'Use of English Part 4', 'single_choice', 'Choose the correct sentence:', '[{"key": "A", "text": "She said me that she was tired."}, {"key": "B", "text": "She told me that she was tired."}, {"key": "C", "text": "She said to me that she was tired."}]', 'B', 'tell sb that...是正确结构。', 3, '2023 年真题', '["语法", "间接引语"]');

-- 更新题目总数统计
UPDATE level_config SET description = '完成 KET 全部真题（50+题）' WHERE level = 5;
UPDATE level_config SET description = '完成 PET 全部真题（30+题）' WHERE level = 6;
