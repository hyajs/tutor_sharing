#!/usr/bin/env python3
"""
爬取家教网站内容并导出
目标网站: https://www.zsdbmjj.com/jiajiao/
"""

import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import re
import urllib3

# 禁用SSL警告
urllib3.disable_warnings()

# 配置
TARGET_URL = "https://www.zsdbmjj.com/jiajiao/"
OUTPUT_DIR = "/Users/hyajs/Desktop/python/tutor_sharing/crawled_data"

# 请求头
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
}

def crawl_page(url, encoding='utf-8'):
    """爬取单个页面"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30, verify=False)
        response.encoding = encoding
        return response.text
    except requests.RequestException as e:
        print(f"请求失败: {url}, 错误: {e}")
        return None

def parse_main_page(html):
    """解析主页内容"""
    soup = BeautifulSoup(html, 'html.parser')
    data = {
        'crawl_time': datetime.now().isoformat(),
        'page_title': soup.title.string if soup.title else '',
        'main_content': [],
        'navigation': [],
        'filters': [],
        'tutor_list': [],
        'pagination': None,
        'contact_info': {},
        'raw_html_preview': str(soup)[:5000],  # 保存原始HTML前5000字符
    }

    # 提取导航栏
    nav = soup.find('nav') or soup.find(class_=re.compile(r'nav|menu|header'))
    if nav:
        data['navigation'] = [a.get_text(strip=True) for a in nav.find_all('a') if a.get_text(strip=True)]

    # 提取筛选条件
    filter_selects = soup.find_all('select')
    for select in filter_selects:
        filter_name = select.get('name') or select.get('id', '')
        options = [{'value': opt.get('value', ''), 'text': opt.get_text(strip=True)}
                   for opt in select.find_all('option')]
        data['filters'].append({'name': filter_name, 'options': options})

    # 提取筛选按钮/链接
    filter_elements = soup.find_all(class_=re.compile(r'filter|select|search'))
    for elem in filter_elements[:20]:  # 限制数量
        data['filters'].append({
            'type': elem.name,
            'class': elem.get('class'),
            'text': elem.get_text(strip=True)[:100]
        })

    # 提取家教列表项
    tutor_cards = soup.find_all(class_=re.compile(r'tutor|teacher|item|card|list'))
    for card in tutor_cards[:50]:
        card_data = {
            'tag': card.name,
            'class': card.get('class'),
            'text': card.get_text(strip=True)[:200],
            'links': []
        }
        for a in card.find_all('a', href=True):
            card_data['links'].append({
                'text': a.get_text(strip=True)[:50],
                'href': a.get('href')
            })
        data['tutor_list'].append(card_data)

    # 提取分页信息
    pagination = soup.find(class_=re.compile(r'page|pagen|pageination'))
    if pagination:
        data['pagination'] = {
            'text': pagination.get_text(strip=True)[:200],
            'links': [{'text': a.get_text(strip=True), 'href': a.get('href')}
                      for a in pagination.find_all('a', href=True)]
        }

    # 提取联系信息
    contact_patterns = [
        (re.compile(r'电话|手机|联系.*?\d{3,4}[-\s]?\d{7,8}'), 'phone'),
        (re.compile(r'微信|wechat|wx'), 'wechat'),
        (re.compile(r'地址|location|address'), 'address'),
    ]
    page_text = soup.get_text()
    for pattern, ptype in contact_patterns:
        match = pattern.search(page_text)
        if match:
            data['contact_info'][ptype] = match.group(0)

    return data

def extract_all_links(html, base_url):
    """提取所有链接"""
    soup = BeautifulSoup(html, 'html.parser')
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('/') or href.startswith(base_url):
            full_url = base_url + href if href.startswith('/') else href
            links.append({
                'text': a.get_text(strip=True)[:100],
                'href': full_url
            })
    return links

def crawl_all_pages(base_url, max_pages=10):
    """爬取主站及子页面"""
    results = {
        'base_url': base_url,
        'crawl_time': datetime.now().isoformat(),
        'pages': []
    }

    # 爬取主页
    print(f"正在爬取主页: {base_url}")
    main_html = crawl_page(base_url)
    if main_html:
        results['main_page'] = parse_main_page(main_html)
        results['main_page']['all_links'] = extract_all_links(main_html, base_url)

        # 尝试爬取列表页
        for page in range(1, max_pages + 1):
            page_url = f"{base_url}?page={page}" if page > 1 else base_url
            print(f"正在爬取第 {page} 页: {page_url}")
            page_html = crawl_page(page_url)
            if page_html:
                page_data = parse_main_page(page_html)
                if page_data['tutor_list']:
                    results['pages'].append(page_data)
                else:
                    break

    return results

def save_results(data, output_dir):
    """保存结果到文件"""
    os.makedirs(output_dir, exist_ok=True)

    # 保存完整JSON
    json_path = os.path.join(output_dir, 'crawled_data.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"已保存JSON: {json_path}")

    # 保存HTML
    if 'main_page' in data and 'raw_html_preview' in data['main_page']:
        html_path = os.path.join(output_dir, 'raw_html.html')
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(data['main_page'].get('raw_html_preview', ''))
        print(f"已保存HTML: {html_path}")

    # 保存链接列表
    if 'main_page' in data and 'all_links' in data['main_page']:
        links_path = os.path.join(output_dir, 'all_links.json')
        with open(links_path, 'w', encoding='utf-8') as f:
            json.dump(data['main_page']['all_links'], f, ensure_ascii=False, indent=2)
        print(f"已保存链接: {links_path}")

    # 生成摘要报告
    summary_path = os.path.join(output_dir, 'summary.txt')
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(f"爬取时间: {data['crawl_time']}\n")
        f.write(f"目标URL: {data['base_url']}\n\n")
        if 'main_page' in data:
            mp = data['main_page']
            f.write(f"页面标题: {mp.get('page_title', 'N/A')}\n")
            f.write(f"导航链接数: {len(mp.get('navigation', []))}\n")
            f.write(f"筛选条件数: {len(mp.get('filters', []))}\n")
            f.write(f"家教列表项数: {len(mp.get('tutor_list', []))}\n")
            f.write(f"总链接数: {len(mp.get('all_links', []))}\n\n")

            f.write("导航栏:\n")
            for nav in mp.get('navigation', [])[:10]:
                f.write(f"  - {nav}\n")

            f.write("\n筛选条件:\n")
            for filt in mp.get('filters', [])[:10]:
                f.write(f"  - {filt}\n")

            f.write("\n联系信息:\n")
            for k, v in mp.get('contact_info', {}).items():
                f.write(f"  - {k}: {v}\n")

    print(f"已保存摘要: {summary_path}")

def main():
    print("=" * 50)
    print("家教网站爬虫")
    print("=" * 50)

    # 爬取数据
    data = crawl_all_pages(TARGET_URL, max_pages=5)

    # 保存结果
    save_results(data, OUTPUT_DIR)

    print("\n爬取完成!")
    return data

if __name__ == "__main__":
    main()