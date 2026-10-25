"""Check local HTML/CSS/JavaScript dependencies without a build or external packages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
files = [ROOT / p for p in subprocess.check_output(
    ['git', 'ls-files', '--cached', '--others', '--exclude-standard'], cwd=ROOT, text=True
).splitlines() if (ROOT / p).is_file()]
pages = {}
errors = []
checked = 0


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.refs = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for name in ('href', 'src', 'poster'):
            if attrs.get(name):
                self.refs.append(attrs[name])
        if attrs.get('srcset'):
            self.refs.extend(item.strip().split()[0] for item in attrs['srcset'].split(','))
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'refresh':
            match = re.search(r'url=(.*)', attrs.get('content', ''), re.I)
            if match:
                self.refs.append(match[1].strip())


def check(source, ref, base=None):
    global checked
    url = urlsplit(ref)
    if url.scheme or url.netloc or ref.startswith(('data:', 'blob:')):
        return
    target = (ROOT / unquote(url.path).lstrip('/') if url.path.startswith('/')
              else (base or source.parent) / unquote(url.path)) if url.path else source
    target = target.resolve()
    if target.is_dir():
        target /= 'index.html'
    checked += 1
    if not target.is_file():
        errors.append(f'{source.relative_to(ROOT)}: missing {ref}')
    elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
        errors.append(f'{source.relative_to(ROOT)}: missing anchor {ref}')


public = [p for p in files if p.relative_to(ROOT).parts[0] not in ('tests', 'scripts', 'docs')]
for p in public:
    if p.suffix == '.html':
        pages[p.resolve()] = Page(p.read_text())
for p, page in pages.items():
    for ref in page.refs:
        check(p, ref)
for p in public:
    if p.suffix == '.css':
        for ref in re.findall(r'url\([\s\'"]*([^\)\'"\s]+)', p.read_text()):
            check(p, ref)
    elif p.suffix == '.js' and 'vendor' not in p.parts:
        # Project data uses paths relative to the site root, shared by root/nested pages.
        for ref in re.findall(r'[\'"]((?:\.\./|/)?img/[^\'"\s]+)[\'"]', p.read_text()):
            check(p, ref, ROOT)

if errors:
    raise SystemExit('\n'.join(errors))
print(f'{len(pages)} HTML pages, {checked} local dependencies and anchors checked.')
