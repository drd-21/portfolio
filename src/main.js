import { portfolio } from './data.js';

// Safe rendering helpers: values in data.js are treated as text, not HTML.
const esc = (value = '') => String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const attr = esc;
const safeLink = (url = '') => {
  const link = String(url).trim();
  return /^(https?:\/\/[^\s]+|\.\/assets\/[^\s]+)$/i.test(link) ? link : '';
};
const e = (value) => esc(value ?? '');
const app = document.querySelector('#app');
const { site, about, education, experience, skills, projects, certifications, cv, contact } = portfolio;
const icons = {
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowUp: '<path d="m12 19 0-14m-7 7 7-7 7 7"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
  external: '<path d="M14 4h6v6M10 14 20 4M20 13v7H4V4h7"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72l.45 3.08a2 2 0 0 1-.57 1.7l-1.41 1.41a16 16 0 0 0 4.54 4.54l1.41-1.41a2 2 0 0 1 1.7-.57l3.08.45A2 2 0 0 1 22 16.92Z"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  moon: '<path d="M20.985 12.486A9 9 0 0 1 11.514 3.01a9 9 0 1 0 9.47 9.476Z"/>',
  code: '<path d="m8 17-5-5 5-5m8 0 5 5-5 5m-3-14-2 18"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
  terminal: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/>',
  pen: '<path d="m16 4 4 4-11 11-5 1 1-5L16 4Zm-2 2 4 4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V4a2 2 0 0 1 2-2h14v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="m8.21 13.89-1 8.11L12 19l4.79 3-1-8.12"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18m-9-9c-5 5-5 13 0 18m0-18c5 5 5 13 0 18"/>',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8M8 17h8"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/>',
  linkedin: '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 10v7m0-10v.01M12 17v-7h4a2 2 0 0 1 2 2v5m-6-4a3 3 0 0 1 3-3"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  coffee: '<path d="M4 8h14v7a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V8Zm14 2h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3"/>',
};
function icon(name, size = 20, cls = '') {
  return `<svg class="icon ${attr(cls)}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.sparkles}</svg>`;
}
const sectionHeading = (index, kicker, title, description = '') => `
  <div class="section-heading reveal">
    <p class="eyebrow"><span class="eyebrow-bar"></span>${e(index)} <span class="slash">/</span> ${e(kicker)}</p>
    <h2>${e(title)}</h2>${description ? `<p class="section-description">${e(description)}</p>` : ''}
  </div>`;
const socialLinks = (className = '') => `<div class="social-links ${attr(className)}">${site.socials.map((social) => safeLink(social.url) ? `<a href="${attr(safeLink(social.url))}" target="_blank" rel="noopener noreferrer" aria-label="${attr(social.label)} (opens in new tab)" title="${attr(social.label)}">${icon(social.icon, 19)}</a>` : `<span class="social-placeholder" role="img" aria-label="${attr(social.label)} link not set" title="Add your ${attr(social.label)} URL in src/data.js">${icon(social.icon, 19)}</span>`).join('')}</div>`;
const navSections = [
  ['about', 'About'], ['education', 'Education'], ['experience', 'Experience'],
  ['skills', 'Skills'], ['projects', 'Projects'], ['certifications', 'Credentials'],
  ['resume', 'Resume'], ['contact', 'Contact'],
];
const navLinks = (mobile = false) => navSections.map(([id, label]) => `<a class="nav-link ${mobile ? 'mobile-nav-link' : ''}" href="#${id}" data-section="${id}">${e(label)}</a>`).join('');
const emailHref = `mailto:${encodeURIComponent(site.email)}`;

app.innerHTML = `
  <header class="site-header" id="top">
    <div class="container header-inner">
      <a class="brand" href="#main" aria-label="${attr(site.name)} — back to top"><span class="brand-mark">${e(site.initials)}<span>.</span></span><span class="brand-caption">portfolio<span class="brand-year"> / ${new Date().getFullYear()}</span></span></a>
      <nav class="desktop-nav" aria-label="Primary navigation">${navLinks()}</nav>
      <div class="header-actions">
        <button class="icon-button theme-toggle" id="theme-toggle" type="button" aria-label="Switch theme" title="Switch theme">${icon('sun', 19, 'theme-sun')}${icon('moon', 19, 'theme-moon')}</button>
        <a class="header-contact" href="#contact">Let’s talk ${icon('arrowUpRight', 16)}</a>
        <button class="icon-button mobile-toggle" id="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-navigation">${icon('menu', 22, 'menu-bars')}${icon('x', 22, 'menu-close')}</button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" hidden>${navLinks(true)}<span class="mobile-nav-foot">${e(site.city)} · ${e(site.country)}</span></nav>
  </header>

  <main id="main">
    <section class="hero section" aria-labelledby="hero-title">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="availability-pill reveal"><span class="availability-dot"></span>${e(site.availability)}</div>
          <p class="hero-overline reveal"><img class="hero-avatar" src="${attr(safeLink(site.photo))}" alt="" width="56" height="56" aria-hidden="true"/>Hello there <span aria-hidden="true">✳</span> I’m ${e(site.name)}</p>
          <h1 id="hero-title" class="reveal">Building digital<br/><span class="italic-word">experiences</span> that<br/><span class="gradient-word">feel human<span class="hero-period">.</span></span></h1>
          <p class="hero-role reveal">${e(site.role)}</p>
          <p class="hero-tagline reveal">${e(site.tagline)}</p>
          <p class="hero-description reveal">${e(site.intro)} <span class="hero-description-extended">${e(site.description)}</span></p>
          <div class="hero-actions reveal">
            <a class="button button-primary" href="#projects">View Projects ${icon('arrowUpRight', 18)}</a>
            <a class="button button-secondary" href="${attr(safeLink(site.resumePath))}" target="_blank" rel="noopener noreferrer">View Resume ${icon('arrowUpRight', 18)}</a>
            <a class="button button-tertiary" href="#contact">Contact Me ${icon('arrow', 18)}</a>
          </div>
          <div class="hero-meta reveal"><span>${icon('pin', 17)} ${e(site.city)}, ${e(site.country)}</span><span class="hero-meta-line"></span><a href="#contact">Available for a conversation ${icon('arrow', 16)}</a></div>
        </div>
        <div class="hero-visual reveal" aria-label="Decorative profile illustration">
          <div class="visual-orbit orbit-1"></div><div class="visual-orbit orbit-2"></div>
          <div class="visual-card">
            <div class="portrait-frame"><img src="${attr(safeLink(site.photo))}" alt="${attr(site.photoAlt)}" width="430" height="510" fetchpriority="high" /></div>
            <div class="portrait-label"><span>DESIGN × CODE</span><span class="label-rule"></span><span>01 / 03</span></div>
          </div>
          <div class="floating-tag floating-tag-top">${icon('code', 17)} Web & mobile</div>
          <div class="floating-tag floating-tag-bottom"><span class="tag-star">✳</span> Learning by building</div>
          <span class="visual-cross cross-1" aria-hidden="true">+</span><span class="visual-cross cross-2" aria-hidden="true">+</span>
        </div>
      </div>
      <div class="container hero-bottom"><div class="hero-scroll"><span class="scroll-line"></span> Scroll to explore</div>${socialLinks('hero-social')}<span class="hero-coordinate">MADE IN CAMARINES NORTE</span></div>
    </section>

    <section class="quick-explore" aria-labelledby="quick-explore-title">
      <div class="container">
        <div class="quick-explore-heading"><p class="eyebrow"><span class="eyebrow-bar"></span>Explore</p><h2 id="quick-explore-title">Explore my portfolio</h2></div>
        <nav class="quick-explore-grid" aria-label="Explore portfolio sections">
          <a class="quick-explore-card" href="#projects">${icon('code', 21)}<span><strong>Projects</strong><small>Explore my work</small></span>${icon('arrowUpRight', 17)}</a>
          <a class="quick-explore-card" href="#skills">${icon('layers', 21)}<span><strong>Skills</strong><small>What I work with</small></span>${icon('arrowUpRight', 17)}</a>
          <a class="quick-explore-card" href="#education">${icon('book', 21)}<span><strong>Background</strong><small>My journey</small></span>${icon('arrowUpRight', 17)}</a>
          <a class="quick-explore-card" href="#contact">${icon('mail', 21)}<span><strong>Contact</strong><small>Let’s connect</small></span>${icon('arrowUpRight', 17)}</a>
          <button class="quick-explore-card quick-explore-more" type="button" data-open-more aria-haspopup="dialog" aria-controls="more-dialog" aria-expanded="false">${icon('menu', 21)}<span><strong>More sections</strong><small>Education, experience &amp; more</small></span>${icon('arrowUpRight', 17)}</button>
        </nav>
      </div>
    </section>

    <div class="divider-section" aria-hidden="true"><div class="container"><div class="divider-line"></div></div></div>

    <section class="section about-section" id="about" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-main">
          <p class="eyebrow reveal"><span class="eyebrow-bar"></span>01 <span class="slash">/</span> About me</p>
          <h2 class="about-title reveal" id="about-title">${e(about.headline)}</h2>
          ${about.paragraphs.slice(0, 1).map((paragraph) => `<p class="about-paragraph reveal">${e(paragraph)}</p>`).join('')}
          ${about.paragraphs.length > 1 ? `<details class="about-more reveal" open><summary aria-controls="about-extra-content" aria-expanded="true">Read more about me</summary><div id="about-extra-content">${about.paragraphs.slice(1).map((paragraph) => `<p class="about-paragraph">${e(paragraph)}</p>`).join('')}</div></details>` : ''}
          <a class="text-link reveal" href="#experience">More about my journey ${icon('arrowUpRight', 18)}</a>
        </div>
        <details class="about-side about-details reveal" open>
          <summary class="about-card-top" aria-controls="about-details-content" aria-expanded="true">${icon('sparkles', 19)} BEYOND THE SCREEN <span>✳</span></summary>
          <div class="about-details-body" id="about-details-content">
          <h3>Things that keep<br/>me curious.</h3>
          <div class="interest-list">${about.interests.map((interest, index) => `<span class="interest"><span>${String(index + 1).padStart(2, '0')}</span>${e(interest)}</span>`).join('')}</div>
          <div class="about-facts">${about.facts.map((fact) => `<div><span>${e(fact.label)}</span><strong>${e(fact.value)}</strong></div>`).join('')}</div>
          </div>
        </details>
      </div>
    </section>

    <section class="section shaded-section" id="education" aria-labelledby="education-title">
      <div class="container">
        ${sectionHeading('02', 'Education', 'The foundation.', 'What I am learning, and where my journey began.')}
        <div class="timeline">${education.length ? education.map((edu, index) => `<details class="timeline-item education-item disclosure-card reveal" open><summary class="education-summary" aria-controls="education-content-${index}" aria-expanded="true"><span class="timeline-icon">${icon('book', 24)}</span><span class="education-summary-copy"><span class="period-label">${e(edu.period)}</span><strong>${e(edu.degree)}</strong><span class="item-organization">${e(edu.school)}</span></span><span class="disclosure-indicator" aria-hidden="true"></span></summary><div class="timeline-main" id="education-content-${index}">${edu.location ? `<p class="small-location">${icon('pin', 14)} ${e(edu.location)}</p>` : ''}${edu.details ? `<p class="muted-text">${e(edu.details)}</p>` : ''}${edu.highlights?.length ? `<div class="chip-list">${edu.highlights.map((subject) => `<span class="chip">${e(subject)}</span>`).join('')}</div>` : ''}${edu.honors?.length ? `<h4 class="optional-list-heading">Honors & awards</h4><div class="chip-list">${edu.honors.map((honor) => `<span class="chip">${e(honor)}</span>`).join('')}</div>` : ''}</div></details>`).join('') : '<p class="muted-text">Education details will be added here.</p>'}</div>
      </div>
    </section>

    <section class="section" id="experience" aria-labelledby="experience-title">
      <div class="container">
        ${sectionHeading('03', 'Experience', 'Learning through doing.', 'A mix of hands-on project work, collaboration and leadership.')}
        <div class="experience-list">${experience.length ? experience.map((job, index) => `<details class="experience-item disclosure-card reveal" open><summary class="experience-summary" aria-controls="experience-content-${index}" aria-expanded="true"><span class="experience-index">${String(index + 1).padStart(2, '0')}</span><span class="experience-summary-copy"><span class="experience-kicker"><span>${e(job.type)}</span><span>${e(job.period)}</span></span><strong>${e(job.role)}</strong><span class="item-organization">${e(job.organization)}</span></span><span class="disclosure-indicator" aria-hidden="true"></span></summary><div class="experience-content" id="experience-content-${index}">${job.description ? `<p class="muted-text">${e(job.description)}</p>` : ''}${job.bullets?.length || job.achievements?.length ? `<ul>${[...(job.bullets || []), ...(job.achievements || [])].map((bullet) => `<li>${e(bullet)}</li>`).join('')}</ul>` : ''}</div></details>`).join('') : '<p class="muted-text">Experience and activities will be added here.</p>'}</div>
      </div>
    </section>

    <section class="section shaded-section" id="skills" aria-labelledby="skills-title">
      <div class="container">
        ${sectionHeading('04', 'Toolkit', 'Where Ideas Meet Implementation.', 'My approach combines system conceptualization, thoughtful planning, and AI-assisted development. I focus on transforming ideas into functional digital solutions while continuously strengthening my technical understanding and problem-solving abilities.')}
        <div class="skills-grid">${skills.map((group, index) => `<details class="skill-card reveal" open><summary class="skill-card-summary" aria-controls="skill-items-${index}" aria-expanded="true"><span class="skill-icon">${icon(group.icon, 25)}</span><h3>${e(group.category)}</h3><span class="skill-number">0${index + 1}</span><span class="disclosure-indicator" aria-hidden="true"></span></summary><div class="skill-tags" id="skill-items-${index}">${group.items.map((item) => `<span${item.proficiency ? ` title="${attr(item.proficiency)}"` : ''}>${e(item.name)}</span>`).join('')}</div></details>`).join('')}</div>
        <p class="skills-note reveal">I use AI as a development partner to accelerate implementation, while focusing on requirements, application workflows, iterative improvement, and functionality.</p>
      </div>
    </section>

    <section class="section work-section" id="projects" aria-labelledby="projects-title">
      <div class="container">
        <div class="work-title-row">${sectionHeading('05', 'Selected work', 'Built with curiosity.', 'A few projects and explorations. Open any card for the story behind it.')}
          <div class="filter-controls reveal" id="project-filters" role="group" aria-label="Filter projects">
            ${['All', ...new Set(projects.map((project) => project.category))].map((category) => `<button class="filter-btn ${category === 'All' ? 'is-selected' : ''}" type="button" data-filter="${attr(category)}" aria-pressed="${category === 'All'}">${e(category)}</button>`).join('')}
          </div>
        </div>
        ${projects.length > 1 ? '<button class="project-view-all" id="project-view-all" type="button" aria-expanded="false" aria-controls="project-grid">View all projects</button>' : ''}
        ${projects.length > 1 ? '<p class="project-browse-hint">Swipe or scroll to browse projects.</p>' : ''}
        <div class="project-grid" id="project-grid" role="region" aria-label="Project collection; horizontally scrollable on small screens" tabindex="0">${projects.length ? projects.map((project, index) => `
          <article class="project-card reveal" data-category="${attr(project.category)}">
            <button class="project-open" type="button" data-project="${attr(project.id)}" aria-label="View ${attr(project.title)} project details">
              <div class="project-image-wrap"><img loading="lazy" decoding="async" src="${attr(safeLink(project.image))}" alt="${attr(project.imageAlt)}" width="800" height="500"/><span class="project-image-arrow">${icon('arrowUpRight', 23)}</span></div>
              <div class="project-body"><div class="project-topline"><span>${String(index + 1).padStart(2, '0')} / ${e(project.category)}${project.featured ? ' · FEATURED' : ''}</span><span>${e(project.year)}</span></div>
              <h3>${e(project.title)} ${icon('arrowUpRight', 20)}</h3><p>${e(project.summary)}</p><div class="project-chips">${project.tags.slice(0, 4).map((tag) => `<span>${e(tag)}</span>`).join('')}</div><span class="project-details-label">View project details ${icon('arrowUpRight', 15)}</span></div>
            </button>
          </article>`).join('') : '<p class="muted-text">Projects will be added here soon.</p>'}</div>
        <div class="work-endnote reveal">Have a project in mind? <a href="#contact">Let’s create something together. ${icon('arrow', 17)}</a></div>
      </div>
    </section>

    <section class="section shaded-section" id="certifications" aria-labelledby="certifications-title">
      <div class="container">
        ${sectionHeading('06', 'Credentials', 'Always a student.', 'Certifications, recognitions and milestones along the way.')}
        ${certifications.length ? `<div class="cert-grid">${certifications.map((cert) => `<article class="cert-card reveal"><div class="cert-icon">${safeLink(cert.image) ? `<img src="${attr(safeLink(cert.image))}" alt="" loading="lazy" decoding="async"/>` : icon('award', 25)}</div><div><span class="cert-date">${e(cert.date)}</span><h3>${e(cert.title)}</h3><p>${e(cert.issuer)}</p>${cert.description ? `<p>${e(cert.description)}</p>` : ''}${cert.credentialId ? `<p class="cert-credential">Credential ID: ${e(cert.credentialId)}</p>` : ''}</div>${safeLink(cert.url) ? `<a class="cert-link" href="${attr(safeLink(cert.url))}" target="_blank" rel="noopener noreferrer" aria-label="Open credential for ${attr(cert.title)}">${icon('external', 19)}</a>` : ''}</article>`).join('')}</div>` : `<div class="empty-state reveal"><div class="empty-state-icon">${icon('award', 28)}</div><div><h3>Credentials are being added.</h3><p>Verified certifications and awards will appear here as they become available.</p></div><span class="empty-state-mark">✳</span></div>`}
      </div>
    </section>

    <section class="section resume-section" id="resume" aria-labelledby="resume-title">
      <div class="container">
        ${sectionHeading('07', 'Résumé & CV', 'The details, on paper.', 'Explore a concise on-page CV or open and download the PDF versions.')}
        <div class="resume-actions reveal"><a class="button button-primary" href="${attr(safeLink(site.resumePath))}" target="_blank" rel="noopener noreferrer">View résumé ${icon('arrowUpRight', 18)}</a><a class="button button-secondary" download href="${attr(safeLink(site.resumePath))}">Download résumé ${icon('download', 18)}</a><a class="button button-secondary" href="${attr(safeLink(site.cvPath))}" target="_blank" rel="noopener noreferrer">View full CV ${icon('arrowUpRight', 18)}</a><a class="button button-secondary" download href="${attr(safeLink(site.cvPath))}">Download CV ${icon('download', 18)}</a></div>
        <div class="resume-grid">
          <details class="cv-panel reveal" aria-label="On-page curriculum vitae" open>
            <summary class="cv-panel-summary" aria-controls="cv-panel-content" aria-expanded="true"><span>On-page CV</span><span class="disclosure-indicator" aria-hidden="true"></span></summary>
              <div class="cv-panel-content" id="cv-panel-content">
            <div class="cv-panel-head"><span>CURRICULUM VITAE</span>${icon('document', 23)}</div>
            <h3>${e(site.name)}</h3><p class="cv-job">${e(site.role)}</p>
            <p class="cv-contact-line">${e(site.city)}, ${e(site.country)} <span>·</span> ${e(site.email)}</p>
            <div class="cv-rule"></div><h4>Profile</h4><p>${e(cv.objective)}</p>
            <h4>Education</h4>${education.map((item) => `<div class="cv-row"><strong>${e(item.degree)}</strong><span>${e(item.school)} · ${e(item.period)}</span></div>`).join('')}
            <h4>Experience</h4>${experience.map((item) => `<div class="cv-row"><strong>${e(item.role)}</strong><span>${e(item.organization)} · ${e(item.period)}</span></div>`).join('')}
            <h4>Technical toolkit</h4><p>${skills.flatMap((group) => group.items).slice(0, 18).map((skill) => e(skill.name)).join(' · ')}</p>
            <h4>Selected projects</h4><p>${projects.map((item) => e(item.title)).join(' · ')}</p>
            ${certifications.length ? `<h4>Certifications</h4><p>${certifications.map((item) => e(item.title)).join(' · ')}</p>` : ''}
            <h4>More about me</h4><ul class="cv-extra">${cv.additional.map((item) => `<li>${e(item)}</li>`).join('')}</ul>
            </div>
          </details>
          <div class="pdf-panel reveal"><div class="pdf-head"><span>${icon('document', 18)} PDF preview</span><div class="pdf-switch" role="group" aria-label="Choose PDF preview"><button type="button" class="pdf-tab is-active" aria-pressed="true" data-pdf="resume">Résumé</button><button type="button" class="pdf-tab" aria-pressed="false" data-pdf="cv">Full CV</button></div></div><iframe class="pdf-viewer" id="pdf-viewer" title="Résumé PDF preview" loading="lazy" data-src="${attr(safeLink(site.resumePath))}#toolbar=0"></iframe><div class="pdf-footer"><span>PDF preview may vary by browser</span><a href="${attr(safeLink(site.resumePath))}" target="_blank" rel="noopener noreferrer" id="pdf-open">Open PDF in new tab ${icon('arrowUpRight', 16)}</a></div></div>
        </div>
      </div>
    </section>

    <section class="section contact-section" id="contact" aria-labelledby="contact-title">
      <div class="container contact-grid">
        <div class="contact-left">
          <p class="eyebrow reveal"><span class="eyebrow-bar"></span>08 <span class="slash">/</span> Contact</p>
          <h2 id="contact-title" class="reveal">${e(contact.headline)}</h2>
          <p class="contact-description reveal">${e(contact.description)}</p>
          <div class="contact-methods reveal">
            <a class="contact-method" href="${attr(emailHref)}"><span class="contact-method-icon">${icon('mail', 21)}</span><span><small>EMAIL ME</small><strong>${e(site.email)}</strong></span>${icon('arrowUpRight', 19)}</a>
            ${site.phone ? `<a class="contact-method" href="tel:${attr(site.phone.replace(/[^\d+]/g, ''))}"><span class="contact-method-icon">${icon('phone', 21)}</span><span><small>CALL ME</small><strong>${e(site.phone)}</strong></span>${icon('arrowUpRight', 19)}</a>` : `<div class="contact-method"><span class="contact-method-icon">${icon('phone', 21)}</span><span><small>PHONE</small><strong class="placeholder-detail">Add your number in src/data.js</strong></span></div>`}
            <div class="contact-method"><span class="contact-method-icon">${icon('pin', 21)}</span><span><small>LOCATION</small><strong>${e(site.city)}, ${e(site.country)}</strong></span></div>
          </div>
          ${socialLinks('contact-social')}
        </div>
        <div class="contact-form-card reveal"><div class="form-topline"><span>DROP A MESSAGE</span><span>✳</span></div><h3>Tell me what’s on your mind.</h3>
          <form id="contact-form" novalidate>
            <div class="form-row"><div class="form-field"><label for="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="100" placeholder="Jane Doe"/><span class="field-error" id="error-name" aria-live="polite"></span></div>
            <div class="form-field"><label for="contact-email">Email address <span>*</span></label><input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="jane@example.com"/><span class="field-error" id="error-email" aria-live="polite"></span></div></div>
            <div class="form-field"><label for="contact-subject">Subject <span>*</span></label><input id="contact-subject" name="subject" type="text" required maxlength="120" placeholder="Let’s work together"/><span class="field-error" id="error-subject" aria-live="polite"></span></div>
            <div class="form-field"><label for="contact-message">Your message <span>*</span></label><textarea id="contact-message" name="message" rows="5" required minlength="15" maxlength="5000" placeholder="Tell me about your idea, timeline, or just say hello…"></textarea><span class="field-error" id="error-message" aria-live="polite"></span></div>
            <div class="honeypot" aria-hidden="true"><label for="contact-company">Leave this field empty</label><input id="contact-company" name="_gotcha" type="text" tabindex="-1" autocomplete="off"/></div>
            <button class="button button-primary form-submit" id="contact-submit" type="submit">Send message ${icon('send', 18)}</button>
            <div class="form-status" id="form-status" aria-live="polite" role="status"></div>
            <p class="form-privacy">No spam, no mailing list. Just a direct conversation.</p>
          </form>
        </div>
      </div>
    </section>
  </main>

  <nav class="mobile-dock" aria-label="Quick navigation">
    <a class="dock-link nav-link" href="#projects" data-section="projects">${icon('code', 19)}<span>Projects</span></a>
    <a class="dock-link nav-link" href="#skills" data-section="skills">${icon('layers', 19)}<span>Skills</span></a>
    <a class="dock-link nav-link" href="#resume" data-section="resume">${icon('document', 19)}<span>Resume</span></a>
    <a class="dock-link nav-link" href="#contact" data-section="contact">${icon('mail', 19)}<span>Contact</span></a>
    <button class="dock-link nav-link" type="button" data-open-more data-sections="about,education,experience,certifications" aria-haspopup="dialog" aria-controls="more-dialog" aria-expanded="false">${icon('menu', 19)}<span>More</span></button>
  </nav>

  <footer class="footer"><div class="container"><div class="footer-top"><div><a class="footer-logo" href="#main">${e(site.initials)}<span>.</span></a><p>${e(site.tagline)}</p></div><div class="footer-right"><p>Let's stay connected.</p>${socialLinks('footer-social')}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${e(site.name)}. All rights reserved.</span><div><a href="#about">About</a><a href="#projects">Work</a><a href="#contact">Contact</a></div><a href="#main" class="back-to-top">Back to top ${icon('arrowUp', 16)}</a></div></div></footer>

  <dialog id="more-dialog" class="more-dialog" aria-modal="true" aria-labelledby="more-dialog-title" aria-describedby="more-dialog-description">
    <div class="more-dialog-head"><div><p class="eyebrow"><span class="eyebrow-bar"></span>Explore</p><h2 id="more-dialog-title">More to discover</h2><p id="more-dialog-description">Explore the people, experience, and milestones behind my work.</p></div><button type="button" class="more-dialog-close" data-close-more aria-label="Close more sections">${icon('x', 21)}</button></div>
    <nav class="more-dialog-links" aria-label="More portfolio sections">
      <a class="nav-link" href="#about" data-more-link data-section="about">${icon('sparkles', 19)}<span><strong>About Me</strong><small>A little more about who I am</small></span>${icon('arrowUpRight', 17)}</a>
      <a class="nav-link" href="#education" data-more-link data-section="education">${icon('book', 19)}<span><strong>Education</strong><small>My academic background</small></span>${icon('arrowUpRight', 17)}</a>
      <a class="nav-link" href="#experience" data-more-link data-section="experience">${icon('layers', 19)}<span><strong>Experience</strong><small>Projects and practical experience</small></span>${icon('arrowUpRight', 17)}</a>
      <a class="nav-link" href="#certifications" data-more-link data-section="certifications">${icon('document', 19)}<span><strong>Certifications</strong><small>Credentials and continued learning</small></span>${icon('arrowUpRight', 17)}</a>
      <a class="nav-link" href="#top" data-more-link>${icon('arrowUp', 19)}<span><strong>Back to Top</strong><small>Return to the beginning</small></span>${icon('arrowUpRight', 17)}</a>
    </nav>
  </dialog>
  <dialog id="project-dialog" class="project-dialog" aria-labelledby="modal-title"><button type="button" class="modal-close modal-close-fixed" data-close-dialog aria-label="Close project details">${icon('x', 23)}</button><div id="project-dialog-body"></div></dialog>
`;

// Update SEO metadata for client-side navigation and local preview. The zero-
// dependency build script also writes these tags into the static HTML so link
// previews and crawlers see the correct data without executing JavaScript.
function updateMeta() {
  const title = `${site.name} — ${site.role}`;
  document.title = title;
  const meta = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute('content', value);
  };
  meta('meta[name="description"]', site.description);
  meta('meta[property="og:title"]', title);
  meta('meta[property="og:description"]', site.intro);
  meta('meta[name="twitter:title"]', title);
  meta('meta[name="twitter:description"]', site.intro);
  if (/^https?:\/\//.test(site.websiteUrl)) {
    const base = new URL(site.websiteUrl);
    const imageUrl = new URL(site.ogImage.replace(/^\.\//, ''), base).href;
    meta('meta[property="og:url"]', base.href);
    meta('meta[property="og:image"]', imageUrl);
    meta('meta[name="twitter:image"]', imageUrl);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = base.href;
  }
}
updateMeta();

// Light / dark theme with persistence and accessible button descriptions.
const themeToggle = document.querySelector('#theme-toggle');
function setTheme(value) {
  const theme = value === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  themeToggle.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* storage unavailable */ }
}
setTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

// Native disclosures remain usable with touch, keyboard, and assistive technology.
const disclosureQuery = matchMedia('(max-width: 740px)');
const responsiveDisclosures = document.querySelectorAll('.skill-card, .about-more, .about-details, .education-item, .experience-item, .cv-panel');
function syncDisclosureLayout() {
  responsiveDisclosures.forEach((disclosure) => {
    const summary = disclosure.querySelector('summary');
    const shouldOpen = !disclosureQuery.matches || (disclosure.classList.contains('skill-card') && disclosure === document.querySelector('.skill-card'));
    disclosure.open = shouldOpen;
    if (summary?.hasAttribute('aria-expanded')) summary.setAttribute('aria-expanded', String(shouldOpen));
  });
}
responsiveDisclosures.forEach((disclosure) => {
  const summary = disclosure.querySelector('summary');
  if (!summary?.hasAttribute('aria-expanded')) return;
  disclosure.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(disclosure.open)));
});
syncDisclosureLayout();
disclosureQuery.addEventListener('change', syncDisclosureLayout);

// Keep the dock out of the opening dashboard; reveal it for long-form browsing.
const quickExplore = document.querySelector('.quick-explore');
const mobileDock = document.querySelector('.mobile-dock');
let dockFrame = 0;
function syncMobileDock() {
  const visible = disclosureQuery.matches && window.scrollY >= quickExplore.offsetTop + quickExplore.offsetHeight;
  document.body.classList.toggle('dock-active', visible);
  mobileDock.hidden = !visible || document.body.classList.contains('form-is-focused');
}
const navTargets = [...document.querySelectorAll('main section[id]')];
function updateActiveSection(id) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const active = link.dataset.section === id || Boolean(link.dataset.sections?.split(',').includes(id));
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function syncActiveSection() {
  const activationPoint = document.querySelector('.site-header').offsetHeight + Math.min(window.innerHeight * 0.25, 160);
  let activeId = '';
  for (const section of navTargets) {
    if (section.getBoundingClientRect().top > activationPoint) break;
    activeId = section.id;
  }
  updateActiveSection(activeId);
}
function syncMobileNavigation() {
  syncMobileDock();
  syncActiveSection();
}
window.addEventListener('scroll', () => {
  if (!dockFrame) dockFrame = requestAnimationFrame(() => {
    dockFrame = 0;
    syncMobileNavigation();
  });
}, { passive: true });
window.addEventListener('resize', syncMobileNavigation);
syncMobileNavigation();

// Mobile menu and escape / resize handling.
const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-navigation');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-is-open');
}
menuToggle.addEventListener('click', () => {
  if (window.innerWidth <= 740) return;
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !willOpen;
  document.body.classList.toggle('menu-is-open', willOpen);
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth <= 740 || window.innerWidth > 980) closeMenu(); });
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (moreDialog.open) {
    event.preventDefault();
    closeMoreDialog();
  } else if (dialog.open) {
    event.preventDefault();
    dialog.close();
  }
  closeMenu();
});

// Keep the mobile dock out of the way while the on-screen keyboard is active.
const contactForm = document.querySelector('#contact-form');
contactForm.addEventListener('focusin', (event) => {
  if (event.target.matches('input:not([type="hidden"]), textarea')) {
    document.body.classList.add('form-is-focused');
    mobileDock.hidden = true;
  }
});
contactForm.addEventListener('focusout', () => {
  requestAnimationFrame(() => {
    if (!contactForm.contains(document.activeElement) || !document.activeElement.matches('input:not([type="hidden"]), textarea')) {
      document.body.classList.remove('form-is-focused');
      mobileDock.hidden = !document.body.classList.contains('dock-active');
    }
  });
});

// Progressive reveal animations; always honor reduced motion settings.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px 30px 0px' });
  document.documentElement.classList.add('motion-ready');
  reveals.forEach((item) => revealObserver.observe(item));
}

// Project filters. Hidden cards remain keyboard-inaccessible.
document.querySelectorAll('.filter-btn').forEach((button) => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    const active = btn === button;
    btn.classList.toggle('is-selected', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach((card) => {
    card.hidden = selected !== 'All' && card.dataset.category !== selected;
  });
}));
const projectGrid = document.querySelector('#project-grid');
const projectViewAll = document.querySelector('#project-view-all');
projectViewAll?.addEventListener('click', () => {
  const expanded = projectViewAll.getAttribute('aria-expanded') !== 'true';
  projectViewAll.setAttribute('aria-expanded', String(expanded));
  projectViewAll.textContent = expanded ? 'Back to project carousel' : 'View all projects';
  projectGrid.classList.toggle('is-expanded', expanded);
});

// Native dialog gives keyboard focus management and Escape-to-close for free.
const dialog = document.querySelector('#project-dialog');
const dialogBody = document.querySelector('#project-dialog-body');
const moreDialog = document.querySelector('#more-dialog');
const moreTriggers = [...document.querySelectorAll('[data-open-more]')];
let currentProject = null;
let projectTrigger = null;
let moreTrigger = null;
function openMoreDialog(trigger) {
  if (moreDialog.open || dialog.open) return;
  if (!mobileNav.hidden) closeMenu();
  if (document.activeElement instanceof HTMLElement && document.activeElement.matches('input:not([type="hidden"]), textarea')) {
    document.activeElement.blur();
  }
  moreTrigger = trigger;
  moreTriggers.forEach((item) => item.setAttribute('aria-expanded', String(item === trigger)));
  moreDialog.showModal();
  moreDialog.querySelector('[data-more-link]').focus({ preventScroll: true });
}
function closeMoreDialog(returnValue = '') {
  if (moreDialog.open) moreDialog.close(returnValue);
}
moreTriggers.forEach((trigger) => trigger.addEventListener('click', () => openMoreDialog(trigger)));
moreDialog.querySelector('[data-close-more]').addEventListener('click', () => closeMoreDialog());
moreDialog.addEventListener('click', (event) => {
  if (event.target === moreDialog) closeMoreDialog();
});
moreDialog.addEventListener('close', (event) => {
  moreTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  if (event.target.returnValue !== 'navigate' && moreTrigger?.isConnected) moreTrigger.focus({ preventScroll: true });
});
moreDialog.querySelectorAll('[data-more-link]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  const href = link.getAttribute('href');
  const target = document.querySelector(href === '#top' ? '#main' : href);
  if (!target) return;
  closeMoreDialog('navigate');
  history.pushState(null, '', href);
  updateActiveSection(link.dataset.section || '');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (href === '#top') {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    document.querySelector('.brand').focus({ preventScroll: true });
    return;
  }
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  const focusTarget = target.querySelector('h1, h2') || target;
  focusTarget.setAttribute('tabindex', '-1');
  focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
  focusTarget.focus({ preventScroll: true });
}));
const renderProjectList = (heading, items) => items?.length
  ? `<h3>${e(heading)}</h3><ul class="modal-contributions">${items.map((item) => `<li>${icon('check', 17)} ${e(item)}</li>`).join('')}</ul>`
  : '';
function openProject(id, updateUrl = true) {
  if (moreDialog.open) closeMoreDialog();
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  currentProject = id;
  projectTrigger = document.activeElement;
  dialogBody.innerHTML = `
    <div class="modal-cover"><img src="${attr(safeLink(project.image))}" alt="${attr(project.imageAlt)}" width="800" height="500" /></div>
    <div class="modal-copy"><div class="modal-kicker">${e(project.category)} <span>·</span> ${e(project.year)}${project.status ? ` <span>·</span> ${e(project.status)}` : ''}</div><h2 id="modal-title">${e(project.title)}</h2><p class="modal-subtitle">${e(project.subtitle)}</p><p class="modal-description">${e(project.detail)}</p>${renderProjectList('My contributions', project.contribution)}${renderProjectList('Features', project.features)}${renderProjectList('Challenges', project.challenges)}${project.tags?.length ? `<div class="project-chips">${project.tags.map((tag) => `<span>${e(tag)}</span>`).join('')}</div>` : ''}${project.screenshots?.length ? `<h3>Project screenshots</h3><div class="modal-gallery">${project.screenshots.map((image, index) => `<img src="${attr(safeLink(image))}" alt="${attr(`${project.title} screenshot ${index + 1}`)}" loading="lazy" decoding="async"/>`).join('')}</div>` : ''}<div class="modal-actions">${safeLink(project.demo) ? `<a class="button button-primary" href="${attr(safeLink(project.demo))}" target="_blank" rel="noopener noreferrer">Live project ${icon('external', 17)}</a>` : ''}${safeLink(project.github) ? `<a class="button button-secondary" href="${attr(safeLink(project.github))}" target="_blank" rel="noopener noreferrer">View code ${icon('github', 17)}</a>` : ''}${!safeLink(project.demo) && !safeLink(project.github) ? '<span class="modal-link-note">Live and source links will appear when added to the content file.</span>' : ''}</div></div>`;
  if (!dialog.open) dialog.showModal();
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.id);
    history.replaceState(null, '', url);
  }
}
function clearProjectUrl() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('project')) {
    url.searchParams.delete('project');
    history.replaceState(null, '', url);
  }
}
document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.project)));
dialog.addEventListener('click', (event) => {
  if (event.target === dialog || event.target.closest('[data-close-dialog]')) dialog.close();
});
dialog.addEventListener('close', () => {
  currentProject = null;
  clearProjectUrl();
  if (projectTrigger && projectTrigger.isConnected) projectTrigger.focus({ preventScroll: true });
});
window.addEventListener('popstate', () => {
  const id = new URL(window.location.href).searchParams.get('project');
  if (id) openProject(id, false);
  else if (dialog.open) dialog.close();
  requestAnimationFrame(syncActiveSection);
});
const initialProject = new URL(window.location.href).searchParams.get('project');
if (initialProject) openProject(initialProject, false);

// Defer loading the embedded PDF viewer on small screens; direct PDF links remain available.
const pdfViewer = document.querySelector('#pdf-viewer');
const pdfQuery = matchMedia('(max-width: 740px)');
function syncPdfViewer() {
  const path = pdfViewer.dataset.path || pdfViewer.dataset.src;
  if (pdfQuery.matches) {
    pdfViewer.removeAttribute('src');
    return;
  }
  if (path && pdfViewer.getAttribute('src') !== path) pdfViewer.src = path;
}
pdfViewer.dataset.path = pdfViewer.dataset.src;
syncPdfViewer();
pdfQuery.addEventListener('change', syncPdfViewer);

// Embedded PDF switching, with download/open links kept in sync.
document.querySelectorAll('[data-pdf]').forEach((button) => button.addEventListener('click', () => {
  const type = button.dataset.pdf;
  const path = type === 'cv' ? site.cvPath : site.resumePath;
  document.querySelectorAll('[data-pdf]').forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', String(active));
  });
  const viewer = document.querySelector('#pdf-viewer');
  viewer.dataset.path = `${safeLink(path)}#toolbar=0`;
  if (!pdfQuery.matches) viewer.src = viewer.dataset.path;
  viewer.title = `${type === 'cv' ? 'CV' : 'Résumé'} PDF preview`;
  document.querySelector('#pdf-open').href = safeLink(path);
}));

// Formspree: create a free form at https://formspree.io/ and paste its form ID
// into src/data.js. Public form IDs are not secrets. Never embed a private key.
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const submit = document.querySelector('#contact-submit');
const fields = ['name', 'email', 'subject', 'message'];
function fieldError(name, message) {
  const input = form.elements.namedItem(name);
  const error = document.querySelector(`#error-${name}`);
  if (!input || !error) return;
  error.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  input.setAttribute('aria-describedby', `error-${name}`);
}
function validateForm() {
  const values = Object.fromEntries(fields.map((name) => [name, String(form.elements.namedItem(name).value).trim()]));
  const errors = {
    name: values.name.length < 2 ? 'Please enter at least 2 characters.' : '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254 ? 'Please enter a valid email address.' : '',
    subject: values.subject.length < 3 ? 'Please enter a short subject.' : '',
    message: values.message.length < 15 ? 'Please write at least 15 characters.' : '',
  };
  fields.forEach((name) => fieldError(name, errors[name]));
  return { values, valid: !Object.values(errors).some(Boolean) };
}
fields.forEach((name) => form.elements.namedItem(name).addEventListener('input', () => fieldError(name, '')));
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.className = 'form-status';
  status.textContent = '';
  const { values, valid } = validateForm();
  if (!valid) {
    fields.map((name) => form.elements.namedItem(name)).find((input) => input.getAttribute('aria-invalid') === 'true')?.focus();
    return;
  }
  if (String(form.elements.namedItem('_gotcha').value).trim()) {
    status.textContent = 'Thanks for your message.';
    status.classList.add('is-success');
    form.reset();
    return;
  }
  const formId = String(contact.formspreeId).trim();
  if (!/^[A-Za-z0-9]{8,}$/.test(formId)) {
    status.classList.add('is-error');
    status.textContent = 'This demo form is not connected yet. Add your Formspree form ID in src/data.js, or email me directly using the link on the left.';
    return;
  }
  submit.disabled = true;
  submit.setAttribute('aria-busy', 'true');
  submit.innerHTML = `Sending… ${icon('send', 18)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...values, _replyto: values.email, _subject: `Portfolio contact: ${values.subject}`, _gotcha: '' }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.errors?.map((error) => error.message).filter(Boolean).join(' ') || 'The service could not send your message. Please try again.';
      throw new Error(message);
    }
    status.classList.add('is-success');
    status.textContent = contact.successMessage;
    form.reset();
    fields.forEach((name) => fieldError(name, ''));
  } catch (error) {
    status.classList.add('is-error');
    status.textContent = error.name === 'AbortError' ? 'The request timed out. Please try again or email me directly.' : (error instanceof TypeError ? 'Network error. Check your connection and try again.' : error.message);
  } finally {
    clearTimeout(timeout);
    submit.disabled = false;
    submit.removeAttribute('aria-busy');
    submit.innerHTML = `Send message ${icon('send', 18)}`;
  }
});
