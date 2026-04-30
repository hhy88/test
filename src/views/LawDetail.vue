<template>
  <div class="law-detail">
    <div class="container">
      <div v-if="law" class="detail-content">
        <router-link to="/" class="back-link">
          ← 返回列表
        </router-link>
        
        <div class="law-header">
          <div class="law-meta">
            <span class="category-tag" :class="getCategoryClass(law.group)">
              {{ getCategoryName(law.group) }}
            </span>
            <span class="level-tag" :class="getLevelClass(law.experience)">
              {{ getLevelName(law.experience) }}
            </span>
          </div>
          <h1 class="law-title">{{ law.title }}</h1>
          <p class="law-subtitle">{{ law.shortTitle }}</p>
          <p class="law-desc">{{ law.description }}</p>
        </div>

        <div class="law-body">
          <section v-if="law.metaphor" class="section">
            <h2 class="section-title">打个比方</h2>
            <div class="section-content metaphor">
              <p>{{ law.metaphor }}</p>
            </div>
          </section>

          <section v-if="law.example" class="section">
            <h2 class="section-title">举个例子</h2>
            <div class="section-content example">
              <p>{{ law.example }}</p>
            </div>
          </section>

          <section v-if="law.takeaways && law.takeaways.length" class="section">
            <h2 class="section-title">记住这几点</h2>
            <ul class="list">
              <li v-for="(item, idx) in law.takeaways" :key="idx">
                {{ item }}
              </li>
            </ul>
          </section>

          <section v-if="law.commonMistakes && law.commonMistakes.length" class="section">
            <h2 class="section-title">容易踩的坑</h2>
            <ul class="list mistakes">
              <li v-for="(item, idx) in law.commonMistakes" :key="idx">
                {{ item }}
              </li>
            </ul>
          </section>

          <section v-if="law.practiceTips && law.practiceTips.length" class="section">
            <h2 class="section-title">怎么用起来</h2>
            <ul class="list tips">
              <li v-for="(item, idx) in law.practiceTips" :key="idx">
                {{ item }}
              </li>
            </ul>
          </section>

          <section v-if="law.related && law.related.length" class="section">
            <h2 class="section-title">相关法则</h2>
            <div class="related-list">
              <router-link
                v-for="slug in law.related"
                :key="slug"
                :to="`/law/${slug}`"
                class="related-item"
              >
                → {{ getRelatedTitle(slug) }}
              </router-link>
            </div>
          </section>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>没找到这条法则</h2>
        <p>可能已经被删除了</p>
        <router-link to="/" class="back-link">
          ← 返回列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { lawsData } from '../data/laws.js'

const route = useRoute()

const law = computed(() => {
  return lawsData.laws.find(l => l.slug === route.params.slug)
})

const getCategoryClass = (group) => {
  const map = {
    'Architecture': 'cat-arch',
    'Teams': 'cat-team',
    'Planning': 'cat-plan',
    'Quality': 'cat-quality',
    'Scale': 'cat-scale',
    'Design': 'cat-design',
    'Decisions': 'cat-decision'
  }
  return map[group] || ''
}

const getCategoryName = (group) => {
  const map = {
    'Architecture': '架构',
    'Teams': '团队',
    'Planning': '规划',
    'Quality': '质量',
    'Scale': '规模',
    'Design': '设计',
    'Decisions': '决策'
  }
  return map[group] || group
}

const getLevelClass = (level) => {
  const map = {
    'junior': 'lvl-junior',
    'mid': 'lvl-mid',
    'senior': 'lvl-senior'
  }
  return map[level] || ''
}

const getLevelName = (level) => {
  const map = {
    'junior': '初级',
    'mid': '中级',
    'senior': '高级'
  }
  return map[level] || level
}

const getRelatedTitle = (slug) => {
  const related = lawsData.laws.find(l => l.slug === slug)
  return related ? related.title : slug
}
</script>

<style scoped>
.law-detail {
  padding: 1.5rem 0 3rem;
}

.back-link {
  display: inline-block;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.back-link:hover {
  color: var(--primary-color);
}

.detail-content {
  max-width: 720px;
  margin: 0 auto;
}

.law-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.law-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.category-tag, .level-tag {
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.cat-arch { background: var(--warm-blue); color: #1976d2; }
.cat-team { background: var(--warm-pink); color: #c2185b; }
.cat-plan { background: var(--warm-green); color: #388e3c; }
.cat-quality { background: var(--warm-yellow); color: #f57c00; }
.cat-scale { background: var(--warm-purple); color: #7b1fa2; }
.cat-design { background: var(--warm-orange); color: #e64a19; }
.cat-decision { background: #eceff1; color: #455a64; }

.lvl-junior { background: #e8f5e9; color: #2e7d32; }
.lvl-mid { background: #fff3e0; color: #ef6c00; }
.lvl-senior { background: #fce4ec; color: #c2185b; }

.law-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.law-subtitle {
  font-size: 1rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.law-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.law-body {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.section {
  background: var(--surface);
  padding: 1.25rem;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-content {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-primary);
}

.section-content p {
  margin-bottom: 0.75rem;
}

.section-content p:last-child {
  margin-bottom: 0;
}

.metaphor {
  background: var(--warm-yellow);
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid #ffa726;
}

.metaphor p {
  margin: 0;
  color: #e65100;
}

.example {
  background: var(--warm-blue);
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid #42a5f5;
}

.example p {
  margin: 0;
  color: #1565c0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list li {
  position: relative;
  padding: 0.5rem 0 0.5rem 1.25rem;
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.mistakes li::before {
  content: '×';
  color: #e53935;
}

.tips li::before {
  content: '✓';
  color: #43a047;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.related-item {
  padding: 0.625rem 1rem;
  background: var(--background);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: var(--transition);
}

.related-item:hover {
  background: var(--warm-blue);
  color: var(--primary-color);
}

.not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.not-found h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .law-title {
    font-size: 1.5rem;
  }
  
  .section {
    padding: 1rem;
  }
}
</style>
