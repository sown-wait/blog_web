<script setup>
import SocialIcon from '@/components/SocialIcon.vue'
import about from '@/config/about.json'
</script>

<template>
  <section class="about-page site-container">
    <header class="about-intro">
      <p class="eyebrow"><span></span> ABOUT</p>
      <h1>你好，我是 {{ about.name }}。</h1>
      <p>{{ about.role }}</p>
    </header>

    <div class="about-grid">
      <div class="about-copy">
        <p>{{ about.bio }}</p>
        <dl class="about-details">
          <div>
            <dt>所在城市</dt>
            <dd>{{ about.location }}</dd>
          </div>
          <div>
            <dt>联系邮箱</dt>
            <dd><a :href="`mailto:${about.email}`">{{ about.email }}</a></dd>
          </div>
        </dl>
      </div>

      <aside class="profile-card">
        <div class="profile-monogram" aria-hidden="true">雪</div>
        <p>保持好奇，持续书写。</p>
        <div class="profile-pattern" aria-hidden="true">✳ ✦ ❋</div>
      </aside>
    </div>

    <section class="about-section">
      <p class="eyebrow"><span></span> TOOLKIT</p>
      <h2>常用技术</h2>
      <div class="skill-list">
        <span v-for="skill in about.skills" :key="skill">{{ skill }}</span>
      </div>
    </section>

    <section class="about-section social-section">
      <p class="eyebrow"><span></span> FIND ME</p>
      <h2>保持联系</h2>
      <div class="social-list">
        <a v-for="item in about.socialLinks" :key="item.name" :href="item.url" :aria-label="item.name" target="_blank" rel="noreferrer">
          <SocialIcon :type="item.icon" />
          <span>{{ item.name }}</span>
          <span class="social-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  </section>
</template>
