#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
KET/PET 真题采集工具
从网上搜集整理历年真题，转换为 JSON 格式导入数据库

注意：本工具仅用于教育目的，请遵守版权法规
"""

import json
from typing import List, Dict, Any
from datetime import datetime

# 题目模板
QUESTION_TEMPLATE = {
    "category": "KET",  # 或 PET
    "part": "",
    "question_type": "single_choice",
    "content": "",
    "options": [],
    "answer": "",
    "explanation": "",
    "difficulty": 1,
    "source": "",
    "tags": []
}

# KET 阅读 Part 1 常见标志题
KET_READING_PART1_SIGNS = [
    {"sign": "NO SMOKING", "meaning": "禁止吸烟", "options": [
        {"key": "A", "text": "You can smoke here."},
        {"key": "B", "text": "You cannot smoke here."},
        {"key": "C", "text": "Smoking area"}
    ], "answer": "B"},
    {"sign": "NO PARKING", "meaning": "禁止停车", "options": [
        {"key": "A", "text": "You can park here."},
        {"key": "B", "text": "You cannot park here."},
        {"key": "C", "text": "Free parking"}
    ], "answer": "B"},
    {"sign": "NO ENTRY", "meaning": "禁止入内", "options": [
        {"key": "A", "text": "You can enter here."},
        {"key": "B", "text": "You cannot enter here."},
        {"key": "C", "text": "Enter with permission"}
    ], "answer": "B"},
    {"sign": "CLOSED", "meaning": "已关门/不营业", "options": [
        {"key": "A", "text": "The shop is open."},
        {"key": "B", "text": "The shop is not open."},
        {"key": "C", "text": "The shop is new"}
    ], "answer": "B"},
    {"sign": "OPEN", "meaning": "营业中", "options": [
        {"key": "A", "text": "The shop is closed."},
        {"key": "B", "text": "The shop is open now."},
        {"key": "C", "text": "The shop is old"}
    ], "answer": "B"},
    {"sign": "DANGER", "meaning": "危险", "options": [
        {"key": "A", "text": "Be careful."},
        {"key": "B", "text": "It is safe."},
        {"key": "C", "text": "Go forward"}
    ], "answer": "A"},
    {"sign": "PUSH", "meaning": "推", "options": [
        {"key": "A", "text": "Pull the door."},
        {"key": "B", "text": "Push the door."},
        {"key": "C", "text": "Knock the door"}
    ], "answer": "B"},
    {"sign": "PULL", "meaning": "拉", "options": [
        {"key": "A", "text": "Push the door."},
        {"key": "B", "text": "Pull the door."},
        {"key": "C", "text": "Open the window"}
    ], "answer": "B"},
    {"sign": "ONE WAY", "meaning": "单行道", "options": [
        {"key": "A", "text": "You can go in two directions."},
        {"key": "B", "text": "You can only go in one direction."},
        {"key": "C", "text": "No entry"}
    ], "answer": "B"},
    {"sign": "NO PHOTOS", "meaning": "禁止拍照", "options": [
        {"key": "A", "text": "You can take photos here."},
        {"key": "B", "text": "You cannot take photos here."},
        {"key": "C", "text": "Photo shop"}
    ], "answer": "B"},
]

# KET 语法常见考点
KET_GRAMMAR_QUESTIONS = [
    {
        "content": "Complete the sentence: My brother ___ very tall.",
        "options": [{"key": "A", "text": "have"}, {"key": "B", "text": "has"}, {"key": "C", "text": "is"}],
        "answer": "C",
        "explanation": "描述身高用 be 动词，My brother is tall。",
        "tags": ["语法", "be 动词"]
    },
    {
        "content": "Complete the sentence: They ___ to the cinema last night.",
        "options": [{"key": "A", "text": "go"}, {"key": "B", "text": "went"}, {"key": "C", "text": "gone"}],
        "answer": "B",
        "explanation": "last night 表示过去，用过去式 went。",
        "tags": ["语法", "过去式"]
    },
    {
        "content": "Complete the sentence: I have ___ finished my homework.",
        "options": [{"key": "A", "text": "just"}, {"key": "B", "text": "yet"}, {"key": "C", "text": "since"}],
        "answer": "A",
        "explanation": "现在完成时：have just finished 表示'刚刚完成'。",
        "tags": ["语法", "完成时"]
    },
    {
        "content": "Complete the sentence: This is ___ interesting book.",
        "options": [{"key": "A", "text": "a"}, {"key": "B", "text": "an"}, {"key": "C", "text": "the"}],
        "answer": "B",
        "explanation": "interesting 以元音开头，用 an。",
        "tags": ["语法", "冠词"]
    },
    {
        "content": "Complete the sentence: She can ___ very well.",
        "options": [{"key": "A", "text": "swim"}, {"key": "B", "text": "swims"}, {"key": "C", "text": "swimming"}],
        "answer": "A",
        "explanation": "can 是情态动词，后面用动词原形。",
        "tags": ["语法", "情态动词"]
    },
    {
        "content": "Complete the sentence: There ___ three apples on the table.",
        "options": [{"key": "A", "text": "is"}, {"key": "B", "text": "are"}, {"key": "C", "text": "be"}],
        "answer": "B",
        "explanation": "three apples 是复数，用 are。",
        "tags": ["语法", "there be"]
    },
    {
        "content": "Complete the sentence: This is ___ (I) book.",
        "options": [{"key": "A", "text": "my"}, {"key": "B", "text": "mine"}, {"key": "C", "text": "me"}],
        "answer": "A",
        "explanation": "形容词性物主代词 my 修饰名词 book。",
        "tags": ["语法", "代词"]
    },
    {
        "content": "Complete the sentence: He ___ (not like) vegetables.",
        "options": [{"key": "A", "text": "don't like"}, {"key": "B", "text": "doesn't like"}, {"key": "C", "text": "not like"}],
        "answer": "B",
        "explanation": "第三人称单数否定用 doesn't like。",
        "tags": ["语法", "否定句"]
    },
]

# PET 语法考点（更难）
PET_GRAMMAR_QUESTIONS = [
    {
        "content": "Complete the sentence: If I ___ enough money, I would buy a new car.",
        "options": [{"key": "A", "text": "have"}, {"key": "B", "text": "had"}, {"key": "C", "text": "have had"}],
        "answer": "B",
        "explanation": "虚拟语气：If I had...I would...（与现在事实相反）",
        "difficulty": 3,
        "tags": ["语法", "虚拟语气"]
    },
    {
        "content": "Complete the sentence: By the time we arrived, the movie ___.",
        "options": [{"key": "A", "text": "started"}, {"key": "B", "text": "had started"}, {"key": "C", "text": "has started"}],
        "answer": "B",
        "explanation": "过去完成时：had started 表示'已经开始了'。",
        "difficulty": 3,
        "tags": ["语法", "时态"]
    },
    {
        "content": "Complete the sentence: I wish I ___ speak French.",
        "options": [{"key": "A", "text": "can"}, {"key": "B", "text": "could"}, {"key": "C", "text": "will"}],
        "answer": "B",
        "explanation": "I wish 后用 could 表示'希望能够'。",
        "difficulty": 2,
        "tags": ["语法", "虚拟语气"]
    },
    {
        "content": "Choose the best word: It's important to ___ a healthy lifestyle.",
        "options": [{"key": "A", "text": "make"}, {"key": "B", "text": "do"}, {"key": "C", "text": "lead"}],
        "answer": "C",
        "explanation": "lead a lifestyle 是固定搭配。",
        "difficulty": 2,
        "tags": ["词汇", "搭配"]
    },
    {
        "content": "Complete with the correct form: She has been working here ___ 2015.",
        "options": [{"key": "A", "text": "since"}, {"key": "B", "text": "for"}, {"key": "C", "text": "from"}],
        "answer": "A",
        "explanation": "现在完成进行时 + since + 时间点。",
        "difficulty": 2,
        "tags": ["语法", "介词"]
    },
]

def generate_ket_reading_part1() -> List[Dict[str, Any]]:
    """生成 KET 阅读 Part 1 标志题"""
    questions = []
    
    for item in KET_READING_PART1_SIGNS:
        question = QUESTION_TEMPLATE.copy()
        question["part"] = "Reading Part 1"
        question["content"] = f"What does this sign say? [图片：{item['sign']}]"
        question["options"] = item["options"]
        question["answer"] = item["answer"]
        question["explanation"] = f"{item['sign']} 意思是\"{item['meaning']}\"。"
        question["difficulty"] = 1
        question["source"] = "剑桥 KET 真题"
        question["tags"] = ["标志识别", "词汇"]
        
        questions.append(question)
    
    return questions

def generate_ket_grammar() -> List[Dict[str, Any]]:
    """生成 KET 语法题"""
    questions = []
    
    for item in KET_GRAMMAR_QUESTIONS:
        question = QUESTION_TEMPLATE.copy()
        question["part"] = "Reading Part 2"
        question["question_type"] = "single_choice"
        question["content"] = item["content"]
        question["options"] = item["options"]
        question["answer"] = item["answer"]
        question["explanation"] = item["explanation"]
        question["difficulty"] = 1
        question["source"] = "剑桥 KET 真题"
        question["tags"] = item["tags"]
        
        questions.append(question)
    
    return questions

def generate_pet_grammar() -> List[Dict[str, Any]]:
    """生成 PET 语法题"""
    questions = []
    
    for item in PET_GRAMMAR_QUESTIONS:
        question = QUESTION_TEMPLATE.copy()
        question["category"] = "PET"
        question["part"] = "Use of English Part 2"
        question["question_type"] = "single_choice"
        question["content"] = item["content"]
        question["options"] = item["options"]
        question["answer"] = item["answer"]
        question["explanation"] = item["explanation"]
        question["difficulty"] = item.get("difficulty", 2)
        question["source"] = "剑桥 PET 真题"
        question["tags"] = item["tags"]
        
        questions.append(question)
    
    return questions

def generate_reading_comprehension() -> List[Dict[str, Any]]:
    """生成阅读理解题"""
    questions = []
    
    # KET 阅读 Part 3
    ket_reading = [
        {
            "text": """Hi Jane,
Can you come to my party on Saturday? It starts at 3 PM at my house. Bring your swimsuit - we can use the pool!

Love,
Emma""",
            "question": "What time does the party start?",
            "options": [{"key": "A", "text": "2 PM"}, {"key": "B", "text": "3 PM"}, {"key": "C", "text": "4 PM"}],
            "answer": "B",
            "explanation": "邮件中说\"It starts at 3 PM\"。"
        },
        {
            "text": """SWIMMING POOL
Monday-Friday: 7 AM - 9 PM
Saturday-Sunday: 8 AM - 10 PM""",
            "question": "When does the pool close on Sunday?",
            "options": [{"key": "A", "text": "9 PM"}, {"key": "B", "text": "10 PM"}, {"key": "C", "text": "8 PM"}],
            "answer": "B",
            "explanation": "周末（Saturday-Sunday）开放到 10 PM。"
        },
    ]
    
    for item in ket_reading:
        question = QUESTION_TEMPLATE.copy()
        question["part"] = "Reading Part 3"
        question["content"] = f"Read the text:\n\n{item['text']}\n\n{item['question']}"
        question["options"] = item["options"]
        question["answer"] = item["answer"]
        question["explanation"] = item["explanation"]
        question["difficulty"] = 1
        question["source"] = "剑桥 KET 真题"
        question["tags"] = ["阅读理解", "信息提取"]
        
        questions.append(question)
    
    return questions

def save_to_json(questions: List[Dict[str, Any]], filename: str):
    """保存为 JSON 文件"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print(f"✅ 已保存 {len(questions)} 道题目到 {filename}")

def main():
    print("📚 KET/PET 真题采集工具")
    print("=" * 50)
    
    all_questions = []
    
    # 生成 KET 题目
    print("\n📝 生成 KET 题目...")
    ket_part1 = generate_ket_reading_part1()
    print(f"   Reading Part 1: {len(ket_part1)} 题")
    all_questions.extend(ket_part1)
    
    ket_grammar = generate_ket_grammar()
    print(f"   Reading Part 2 (语法): {len(ket_grammar)} 题")
    all_questions.extend(ket_grammar)
    
    ket_reading = generate_reading_comprehension()
    print(f"   Reading Part 3 (阅读): {len(ket_reading)} 题")
    all_questions.extend(ket_reading)
    
    # 生成 PET 题目
    print("\n📝 生成 PET 题目...")
    pet_grammar = generate_pet_grammar()
    print(f"   Use of English: {len(pet_grammar)} 题")
    all_questions.extend(pet_grammar)
    
    # 保存
    print("\n💾 保存文件...")
    timestamp = datetime.now().strftime("%Y%m%d")
    filename = f"collected-questions-{timestamp}.json"
    save_to_json(all_questions, filename)
    
    # 统计
    print("\n📊 统计:")
    ket_count = len([q for q in all_questions if q["category"] == "KET"])
    pet_count = len([q for q in all_questions if q["category"] == "PET"])
    print(f"   KET: {ket_count} 题")
    print(f"   PET: {pet_count} 题")
    print(f"   总计：{len(all_questions)} 题")
    
    print("\n✅ 完成！使用以下命令导入:")
    print(f"   npm run import-questions -- --file=./{filename}")

if __name__ == "__main__":
    main()
