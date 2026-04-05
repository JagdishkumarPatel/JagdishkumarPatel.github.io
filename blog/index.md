---
layout: default
title: Blog
description: Read my latest thoughts on AI/ML, cloud computing, DevOps, and software engineering best practices.
---

<section class="section">
  <h2>Latest Posts</h2>
  <ul class="post-list">
    {% for post in site.posts %}
      <li class="post-item">
        <a href="{{ post.url | relative_url }}" class="post-link">
          <h3>{{ post.title }}</h3>
          <div class="post-meta">{{ post.date | date: "%B %d, %Y" }} • {{ post.tags | join: ", " }}</div>
          <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
        </a>
      </li>
    {% endfor %}
  </ul>
</section>