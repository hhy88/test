<template>
  <div class="home">
    <div class="container">
      <div class="header">
        <h1 class="title">软件工程法则</h1>
        <p class="subtitle">一些写代码时值得记住的道理</p>
        <p class="count">共 {{ lawsData.count }} 条</p>
      </div>

      <div class="filters">
        <div class="filter-row">
          <label>分类：</label>
          <div class="filter-tags">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="['tag', { active: selectedCategory === category.id }]"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>

        <div class="filter-row">
          <label>难度：</label>
          <div class="filter-tags">
            <button
              v-for="level in experienceLevels"
              :key="level.id"
              @click="selectedLevel = level.id"
              :class="['tag', { active: selectedLevel === level.id }]"
            >
              {{ level.icon }} {{ level.name }}
            </button>
          </div>
        </div>

        <div class="search-row">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜一搜..."
            class="search-input"
          />
        </div>
      </div>

      <div class="results">
        <p>找到 {{ filteredLaws.length }} 条法则</p>
      </div>

      <div class="laws-list">
        <router-link
          v-for="law in filteredLaws"
          :key="law.slug"
          :to="`/law/${law.slug}`"
          class="law-card"
        >
          <div class="card-header">
            <span class="category-tag" :class="getCategoryClass(law.group)">
              {{ getCategoryName(law.group) }}
            </span>
            <span class="level-tag" :class="getLevelClass(law.experience)">
              {{ getLevelName(law.experience) }}
            </span>
          </div>
          
          <h3 class="card-title">{{ law.title }}</h3>
          <p class="card-subtitle">{{ law.shortTitle }}</p>
          <p class="card-desc">{{ law.description }}</p>
          
          <div v-if="law.metaphor" class="card-tip">
            <span class="tip-label">💡</span>
            <p>{{ law.metaphor }}</p>
          </div>
        </router-link>
      </div>

      <div v-if="filteredLaws.length === 0" class="empty">
        <p>没找到相关内容，换个关键词试试？</p>
        <button @click="resetFilters" class="reset-btn">重置筛选</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { lawsData, categories, experienceLevels } from '../data/laws.js'

const selectedCategory = ref('all')
const selectedLevel = ref('all')
const searchQuery = ref('')

const filteredLaws = computed(() => {
  return lawsData.laws.filter(law => {
    const matchesCategory = selectedCategory.value === 'all' || law.group === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'all' || law.experience === selectedLevel.value
    const matchesSearch = searchQuery.value === '' || 
      law.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      law.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (law.shortTitle && law.shortTitle.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return matchesCategory && matchesLevel && matchesSearch
  })
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedLevel.value = 'all'
  searchQuery.value = ''
}

const getCategoryClass = (group) => {
  const categoryMap = {
    'Architecture': 'cat-arch',
    'Teams': 'cat-team',
    'Planning': 'cat-plan',
    'Quality': 'cat-quality',
    'Scale': 'cat-scale',
    'Design': 'cat-design',
    'Decisions': 'cat-decision'
  }
  return categoryMap[group] || ''
}

const getCategoryName = (group) => {
  const nameMap = {
    'Architecture': '架构',
    'Teams': '团队',
    'Planning': '规划',
    'Quality': '质量',
    'Scale': '规模',
    'Design': '设计',
    'Decisions': '决策'
  }
  return nameMap[group] || group
}

const getLevelClass = (level) => {
  const levelMap = {
    'junior': 'lvl-junior',
    'mid': 'lvl-mid',
    'senior': 'lvl-senior'
  }
  return levelMap[level] || ''
}

const getLevelName = (level) => {
  const levelMap = {
    'junior': '初级',
    'mid': '中级',
    'senior': '高级'
  }
  return levelMap[level] || level
}
</script>

<style scoped>
.home {
  padding: 2rem 0 4rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.title {
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.count {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.filters {
  background: var(--surface);
  padding: 1.5rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.filter-row {
  margin-bottom: 1rem;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-row label {
  display: inline-block;
  font-weight: 500;
  margin-right: 0.75rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.filter-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  background: var(--background);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.tag:hover {
  background: var(--warm-blue);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.search-row {
  margin-top: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.9375rem;
  background: var(--background);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.results {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.laws-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.law-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.law-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
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

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
  line-height: 1.3;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tip {
  background: var(--warm-yellow);
  padding: 0.625rem;
  border-radius: 4px;
  border-left: 3px solid #ffa726;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: auto;
}

.tip-label {
  font-size: 1rem;
  flex-shrink: 0;
}

.card-tip p {
  font-size: 0.8125rem;
  color: #e65100;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty p {
  margin-bottom: 1rem;
}

.reset-btn {
  padding: 0.5rem 1.25rem;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.reset-btn:hover {
  background: var(--primary-light);
}

@media (max-width: 768px) {
  .title {
    font-size: 1.75rem;
  }
  
  .laws-list {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-row label {
    margin-right: 0;
  }
}
</style>
