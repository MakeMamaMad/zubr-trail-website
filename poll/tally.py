#!/usr/bin/env python3
"""Rebuild publicly-readable poll results from GitHub Issues.

Only one latest valid ballot is counted per distinct GitHub author. User
identity comes from GitHub Issues, not from unchecked browser storage.
"""
import datetime as dt
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
REGISTRY = json.loads((ROOT / 'participants.json').read_text(encoding='utf-8'))
IDS = {item['id'] for item in REGISTRY['participants']}
PREFIX = '[ZUBR-VOTE-2026]'
MARKER = '<!-- ZUBR_VOTE_V1 -->'
MAX = int(REGISTRY['limit_per_category'])


def parse_ballot(issue):
    if issue.get('pull_request') or not str(issue.get('title', '')).startswith(PREFIX):
        return None
    author = issue.get('user') or {}
    login = str(author.get('login', '')).casefold()
    if not login or login.endswith('[bot]'):
        return None
    body = issue.get('body') or ''
    if MARKER not in body or len(body) > 5000:
        return None
    result = {}
    for cat in ('DESKTOP', 'MOBILE'):
        m = re.search(r'^' + cat + r':[ \t]*([^\r\n]*)$', body, flags=re.MULTILINE)
        if not m:
            return None
        raw = m.group(1).strip()
        votes = [x.strip() for x in raw.split(',') if x.strip()] if raw else []
        if len(votes) > MAX or len(votes) != len(set(votes)) or not set(votes).issubset(IDS):
            return None
        result[cat.lower()] = votes
    if not result['desktop'] and not result['mobile']:
        return None
    result['login'] = login
    result['updated_at'] = issue.get('updated_at') or issue.get('created_at') or ''
    result['number'] = int(issue.get('number') or 0)
    return result


def github_issues():
    token = os.environ.get('GITHUB_TOKEN')
    repo = os.environ.get('GITHUB_REPOSITORY', 'MakeMamaMad/zubr-trail-website')
    if not token:
        raise SystemExit('GITHUB_TOKEN is required for live results')
    items = []
    for page in range(1, 101):
        url = f'https://api.github.com/repos/{repo}/issues?state=all&per_page=100&page={page}'
        req = Request(url, headers={'Authorization':'Bearer '+token,
                                    'Accept':'application/vnd.github+json',
                                    'User-Agent':'zubr-trail-site-vote-tally',
                                    'X-GitHub-Api-Version':'2022-11-28'})
        with urlopen(req, timeout=40) as r:
            batch = json.load(r)
        if not isinstance(batch,list):
            raise RuntimeError('Unexpected GitHub API response')
        items.extend(batch)
        if len(batch) < 100:
            break
    return items


def count(issues):
    votes = sorted(filter(None,(parse_ballot(x) for x in issues)),
                   key=lambda x:(x['updated_at'],x['number']),reverse=True)
    by_author = {}
    for entry in votes:
        by_author.setdefault(entry['login'], entry)
    desktop = Counter()
    mobile = Counter()
    for ballot in by_author.values():
        desktop.update(ballot['desktop'])
        mobile.update(ballot['mobile'])
    return {
        'poll_id': REGISTRY['poll_id'],
        'updated_at': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'),
        'ballots': len(by_author),
        'desktop': {p['id']: desktop[p['id']] for p in REGISTRY['participants']},
        'mobile': {p['id']: mobile[p['id']] for p in REGISTRY['participants']},
    }


def test():
    def issue(login, number, desktop, mobile, timestamp):
        return {'title':PREFIX+' Мой выбор','user':{'login':login},'number':number,
                'body':MARKER+'\nDESKTOP: '+desktop+'\nMOBILE: '+mobile,
                'updated_at':timestamp}
    samples = [
        issue('alex',1,'stas,zubr-gold','zubr-lime','2026-11-01T12:00:00Z'),
        issue('alex',2,'zubr-power','zubr-gold','2026-11-02T11:00:00Z'),
        issue('boris',3,'zubr-gold,benalu','stas','2026-11-02T11:00:00Z'),
        issue('c',4,'invalid-id','stas','2026-11-02T11:00:00Z'),
    ]
    data = count(samples)
    assert data['ballots'] == 2
    assert data['desktop']['zubr-power'] == 1
    assert data['desktop']['zubr-gold'] == 1
    assert data['desktop']['stas'] == 0
    assert data['mobile']['zubr-gold'] == 1
    assert data['mobile']['stas'] == 1
    assert data['mobile']['zubr-lime'] == 0
    assert parse_ballot(issue('c',5,'stas,stas','','2026-11-02T11:00:00Z')) is None
    assert parse_ballot(issue('c',6,'stas,benalu,kraker,fliegl','','2026-11-02T11:00:00Z')) is None
    print('PASS: latest ballot per GitHub account, filtering, categories, dedupe and 3-choice limit')


if __name__ == '__main__':
    if '--test' in sys.argv:
        test()
    else:
        results = count(github_issues())
        output = ROOT / 'results.json'
        output.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print('Processed',results['ballots'],'valid GitHub accounts; results:',output)