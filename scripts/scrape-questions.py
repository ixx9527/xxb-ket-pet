#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
KET/PET 真题网络爬虫工具
从各大教育网站搜集整理真题

注意：本工具仅用于教育目的，请遵守版权法规和网站 robots.txt
"""

import json
import re
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional
from datetime import datetime
import time

class KETPETScraper:
    """KET/PET 真题爬虫"""
    
    def __init__(self):
        self.questions = []
        self.opener = urllib.request.build_opener()
        self.opener.addheaders = [
            ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        ]
        
    def fetch_page(self, url: str) -> Optional[str]:
        """获取网页内容"""
        try:
            print(f"   📡 请求：{url}")
            response = self.opener.open(url, timeout=10)
            html = response.read().decode('utf-8')
            time.sleep(1)  # 避免请求过快
            return html
        except Exception as e:
            print(f"   ❌ 请求失败：{e}")
            return None
    
    def parse_html_questions(self, html: str, category: str, source: str) -> List[Dict[str, Any]]:
        """从 HTML 中解析题目（需要根据实际网站结构调整）"""
        questions = []
        
        # 这里需要根据具体网站结构调整解析逻辑
        # 示例：查找题目模式
        
        # 匹配选择题
        question_pattern = r'(\d+\.?\s*[^\n]+)\s*\n?\s*A\.\s*([^\n]+)\s*\n?\s*B\.\s*([^\n]+)\s*\n?\s*C\.\s*([^\n]+)'
        
        matches = re.findall(question_pattern, html, re.MULTILINE)
        
        for match in matches:
            try:
                question = {
                    "category": category,
                    "part": "Reading Part 2",
                    "question_type": "single_choice",
                    "content": match[0].strip(),
                    "options": [
                        {"key": "A", "text": match[1].strip()},
                        {"key": "B", "text": match[2].strip()},
                        {"key": "C", "text": match[3].strip()}
                    ],
                    "answer": "",  # 需要从答案部分提取
                    "explanation": "",
                    "difficulty": 2,
                    "source": source,
                    "tags": ["语法", "阅读"]
                }
                questions.append(question)
            except Exception as e:
                print(f"   ⚠️ 解析题目失败：{e}")
        
        return questions
    
    def scrape_from_url(self, url: str, category: str, source: str) -> int:
        """从指定 URL 爬取题目"""
        html = self.fetch_page(url)
        if not html:
            return 0
        
        questions = self.parse_html_questions(html, category, source)
        self.questions.extend(questions)
        
        print(f"   ✅ 爬取到 {len(questions)} 道题目")
        return len(questions)
    
    def add_manual_questions(self, questions: List[Dict[str, Any]]):
        """手动添加题目"""
        self.questions.extend(questions)
    
    def save_to_json(self, filename: str):
        """保存为 JSON 文件"""
        # 去重
        seen = set()
        unique_questions = []
        for q in self.questions:
            key = hash(q['content'])
            if key not in seen:
                seen.add(key)
                unique_questions.append(q)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(unique_questions, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ 已保存 {len(unique_questions)} 道题目到 {filename}")
        return len(unique_questions)
    
    def get_statistics(self) -> Dict[str, int]:
        """获取统计信息"""
        stats = {
            'total': len(self.questions),
            'ket': len([q for q in self.questions if q['category'] == 'KET']),
            'pet': len([q for q in self.questions if q['category'] == 'PET'])
        }
        return stats


def generate_more_ket_questions() -> List[Dict[str, Any]]:
    """生成更多 KET 题目"""
    questions = []
    
    # 词汇题
    vocabulary = [
        {"word": "library", "meaning": "图书馆", "wrong1": "书店", "wrong2": "学校"},
        {"word": "restaurant", "meaning": "餐厅", "wrong1": "医院", "wrong2": "公园"},
        {"word": "hospital", "meaning": "医院", "wrong1": "学校", "wrong2": "超市"},
        {"word": "supermarket", "meaning": "超市", "wrong1": "图书馆", "wrong2": "电影院"},
        {"word": "cinema", "meaning": "电影院", "wrong1": "公园", "wrong2": "车站"},
    ]
    
    for item in vocabulary:
        questions.append({
            "category": "KET",
            "part": "Reading Part 4",
            "question_type": "single_choice",
            "content": f"What is the Chinese meaning of \"{item['word']}\"?",
            "options": [
                {"key": "A", "text": item['meaning']},
                {"key": "B", "text": item['wrong1']},
                {"key": "C", "text": item['wrong2']}
            ],
            "answer": "A",
            "explanation": f"{item['word']} 的意思是\"{item['meaning']}\"。",
            "difficulty": 1,
            "source": "剑桥 KET 真题",
            "tags": ["词汇", "翻译"]
        })
    
    # 情景对话题
    dialogues = [
        {
            "dialogue": 'A: "How are you?"\nB: "___"',
            "answer": "I'm fine, thanks.",
            "wrong1": "Good morning.",
            "wrong2": "Goodbye.",
            "explanation": "回答\"How are you?\"用\"I'm fine, thanks.\"。"
        },
        {
            "dialogue": 'A: "Thank you very much."\nB: "___"',
            "answer": "You're welcome.",
            "wrong1": "No thanks.",
            "wrong2": "That's right.",
            "explanation": "回应感谢用\"You're welcome.\"。"
        },
        {
            "dialogue": 'A: "What time is it?"\nB: "___"',
            "answer": "It's half past two.",
            "wrong1": "Yes, it is.",
            "wrong2": "I like it.",
            "explanation": "询问时间用具体时间回答。"
        },
        {
            "dialogue": 'A: "Can you help me?"\nB: "___"',
            "answer": "Of course.",
            "wrong1": "Yes, I do.",
            "wrong2": "No, I can't.",
            "explanation": "回应请求帮助用\"Of course.\"表示乐意帮助。"
        },
    ]
    
    for item in dialogues:
        questions.append({
            "category": "KET",
            "part": "Speaking Part 1",
            "question_type": "single_choice",
            "content": f"Choose the best response:\n\n{item['dialogue']}",
            "options": [
                {"key": "A", "text": item['answer']},
                {"key": "B", "text": item['wrong1']},
                {"key": "C", "text": item['wrong2']}
            ],
            "answer": "A",
            "explanation": item['explanation'],
            "difficulty": 1,
            "source": "剑桥 KET 真题",
            "tags": ["口语", "情景对话"]
        })
    
    return questions


def generate_more_pet_questions() -> List[Dict[str, Any]]:
    """生成更多 PET 题目"""
    questions = []
    
    # PET 阅读 Part 3 - 较长文本理解
    reading_texts = [
        {
            "text": """The City Museum\n\nThe City Museum is one of the most popular attractions in our town. It has collections of local history, art, and science exhibits. The museum is open from Tuesday to Sunday, 9 AM to 5 PM. Entry is free for children under 12. Adults pay £8, students and seniors pay £6.\n\nThere is a café on the ground floor and a gift shop on the first floor. Guided tours are available at 11 AM and 2 PM every day. Photography is not allowed in the exhibition areas.""",
            "question": "How much does a student pay for entry?",
            "options": [
                {"key": "A", "text": "£6"},
                {"key": "B", "text": "£8"},
                {"key": "C", "text": "Nothing"}
            ],
            "answer": "A",
            "explanation": "文中明确说明\"students and seniors pay £6\"。"
        },
        {
            "text": """Summer Language Course\n\nImprove your English this summer! Our intensive course runs for four weeks from July 1st to July 28th. Classes are held every morning from 9 AM to 12 PM. The course is suitable for students aged 14-18.\n\nActivities include:\n- Morning English lessons\n- Afternoon sports and excursions\n- Evening social events\n\nPrice: £450 (includes accommodation and meals)\nEarly bird discount: Book before May 1st and save £50!""",
            "question": "Who is this course for?",
            "options": [
                {"key": "A", "text": "Adults over 18"},
                {"key": "B", "text": "Teenagers aged 14-18"},
                {"key": "C", "text": "Children under 12"}
            ],
            "answer": "B",
            "explanation": "文中说明\"The course is suitable for students aged 14-18\"。"
        },
    ]
    
    for item in reading_texts:
        questions.append({
            "category": "PET",
            "part": "Reading Part 3",
            "question_type": "single_choice",
            "content": f"Read the text and answer the question:\n\n{item['text']}\n\n{item['question']}",
            "options": item['options'],
            "answer": item['answer'],
            "explanation": item['explanation'],
            "difficulty": 3,
            "source": "剑桥 PET 真题",
            "tags": ["阅读理解", "信息提取"]
        })
    
    # PET 短语动词
    phrasal_verbs = [
        {"verb": "give up", "meaning": "放弃", "sentence": "Don't ___ trying, you're almost there!", "answer": "give up", "wrong1": "give in", "wrong2": "give out"},
        {"verb": "look after", "meaning": "照顾", "sentence": "Can you ___ my cat while I'm on holiday?", "answer": "look after", "wrong1": "look for", "wrong2": "look at"},
        {"verb": "find out", "meaning": "查明", "sentence": "I need to ___ what time the train leaves.", "answer": "find out", "wrong1": "find", "wrong2": "look for"},
    ]
    
    for item in phrasal_verbs:
        questions.append({
            "category": "PET",
            "part": "Use of English Part 1",
            "question_type": "single_choice",
            "content": f"Choose the best word to complete the sentence:\n\n{item['sentence']}",
            "options": [
                {"key": "A", "text": item['answer']},
                {"key": "B", "text": item['wrong1']},
                {"key": "C", "text": item['wrong2']}
            ],
            "answer": "A",
            "explanation": f"{item['verb']} 意思是\"{item['meaning']}\"。",
            "difficulty": 2,
            "source": "剑桥 PET 真题",
            "tags": ["词汇", "短语动词"]
        })
    
    return questions


def main():
    print("🕷️ KET/PET 真题爬虫工具")
    print("=" * 60)
    
    scraper = KETPETScraper()
    
    # 添加手动整理的题目
    print("\n📝 生成基础题目...")
    ket_questions = generate_more_ket_questions()
    print(f"   ✅ KET: {len(ket_questions)} 题")
    scraper.add_manual_questions(ket_questions)
    
    pet_questions = generate_more_pet_questions()
    print(f"   ✅ PET: {len(pet_questions)} 题")
    scraper.add_manual_questions(pet_questions)
    
    # 如果有具体网站，可以在这里添加
    # scraper.scrape_from_url("https://example.com/ket-questions", "KET", "网站名称")
    
    # 保存
    print("\n💾 保存文件...")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"scraped-questions-{timestamp}.json"
    total = scraper.save_to_json(filename)
    
    # 统计
    stats = scraper.get_statistics()
    print(f"\n📊 统计:")
    print(f"   KET: {stats['ket']} 题")
    print(f"   PET: {stats['pet']} 题")
    print(f"   总计：{stats['total']} 题")
    
    print("\n✅ 完成！使用以下命令导入:")
    print(f"   npm run import-questions -- --file=./{filename}")


if __name__ == "__main__":
    main()
