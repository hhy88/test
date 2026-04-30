<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <span class="logo-icon">⚖️</span>
          <span class="logo-text">软件工程法则</span>
        </router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <a href="https://lawsofsoftwareengineering.com/" target="_blank" class="nav-link">英文原版</a>
        </nav>
      </div>
    </header>
    
    <main class="main">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>© 2024 软件工程法则中文版 | 基于 <a href="https://lawsofsoftwareengineering.com/" target="_blank">Laws of Software Engineering</a></p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.logo-icon {
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.1);
}

.main {
  min-height: calc(100vh - 140px);
  padding: 2rem 0;
}

.footer {
  background: var(--surface);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>
