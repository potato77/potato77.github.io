const publicationArchive = document.querySelector('#publicationArchive');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function iconLink(label, url, iconName, options = {}) {
  const link = element('a', 'paper-link');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  if (options.download) link.download = options.download;
  link.innerHTML = `<i data-lucide="${iconName}"></i><span>${label}</span>`;
  return link;
}

function splitInfo(value) {
  const separator = value.search(/[：:]/);
  if (separator < 0) return ['', value];
  return [value.slice(0, separator), value.slice(separator + 1).trim() || '—'];
}

function renderPaper(paper) {
  const article = element('article', 'paper-entry');
  article.id = paper.id;

  const figure = element('figure', 'paper-thumb');
  const image = document.createElement('img');
  image.src = paper.image;
  image.alt = `${paper.title} 论文预览`;
  image.loading = 'lazy';
  figure.append(image);

  const body = element('div', 'paper-body');
  const title = element('h3');
  const titleLink = element('a', '', paper.title);
  titleLink.href = paper.paper_url;
  titleLink.target = '_blank';
  titleLink.rel = 'noreferrer';
  title.append(titleLink);

  const authors = element('p', 'paper-authors');
  paper.authors.forEach((author, index) => {
    const isSelf = /^(Yuhua|Yu-Hua) Qi$/i.test(author);
    const authorNode = element(isSelf ? 'strong' : 'span', isSelf ? 'author-self' : '', author);
    authors.append(authorNode);
    if (paper.corresponding_authors?.includes(author)) {
      const marker = element('sup', 'corresponding-author', '*');
      marker.title = 'Corresponding author';
      marker.setAttribute('aria-label', '，通信作者');
      authors.append(marker);
    }
    if (index < paper.authors.length - 1) authors.append(document.createTextNode(', '));
  });

  const venue = element('p', 'paper-venue', paper.venue);
  const actions = element('div', 'paper-actions');
  const pdfName = paper.paper_url.startsWith('papers/') ? paper.paper_url.slice('papers/'.length) : '';
  actions.append(iconLink('PDF', paper.paper_url, 'download', { download: pdfName }));
  paper.links.forEach(link => {
    const iconName = link.label.toLowerCase().includes('code') ? 'code-2' : 'external-link';
    actions.append(iconLink(link.label, link.url, iconName));
  });

  const info = element('details', 'paper-info');
  const summary = element('summary', 'paper-link');
  summary.innerHTML = '<i data-lucide="info"></i><span>Info</span>';
  const panel = element('div', 'paper-info-panel');
  const list = document.createElement('dl');
  paper.info.forEach(item => {
    const [label, value] = splitInfo(item);
    list.append(element('dt', '', label), element('dd', '', value));
  });
  list.append(element('dt', '', '原发表页面'));
  const publishedItem = document.createElement('dd');
  const publishedLink = element('a', '', '查看出版社记录');
  publishedLink.href = paper.published_url;
  publishedLink.target = '_blank';
  publishedLink.rel = 'noreferrer';
  publishedItem.append(publishedLink);
  list.append(publishedItem);
  panel.append(list);
  info.append(summary, panel);
  actions.append(info);

  body.append(title, authors, venue, actions);
  article.append(figure, body);
  return article;
}

async function renderPublications() {
  try {
    const response = await fetch('publications.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const papers = await response.json();
    const grouped = papers.reduce((years, paper) => {
      if (!years.has(paper.year)) years.set(paper.year, []);
      years.get(paper.year).push(paper);
      return years;
    }, new Map());

    publicationArchive.replaceChildren();
    [...grouped.entries()].sort(([a], [b]) => b - a).forEach(([year, yearPapers]) => {
      const section = element('section', 'publication-year');
      section.setAttribute('aria-labelledby', `year-${year}`);
      const heading = element('h2', 'publication-year-heading', String(year));
      heading.id = `year-${year}`;
      const list = element('div', 'paper-list');
      yearPapers.forEach(paper => list.append(renderPaper(paper)));
      section.append(heading, list);
      publicationArchive.append(section);
    });
    renderIcons();
  } catch (error) {
    publicationArchive.replaceChildren(element('p', 'publication-error', '论文列表暂时无法加载。'));
  }
}

renderPublications();
