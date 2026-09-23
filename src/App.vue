<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useIncidentsStore } from './stores/incidents'

const route = useRoute()
const store = useIncidentsStore()

const nav = [
  { to: '/', label: 'Triaje' },
  { to: '/bandeja', label: 'Bandeja' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

const count = computed(() => store.total)
</script>

<template>
  <div class="min-h-screen">
    <!-- Barra superior -->
    <header class="sticky top-0 z-50 border-b border-ink-700/40 bg-ink text-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div class="flex items-center gap-2.5">
          <span
            class="grid h-8 w-8 place-items-center rounded-lg bg-teal font-display text-lg font-bold text-ink"
          >
            P
          </span>
          <div class="leading-tight">
            <p class="font-display text-base font-semibold">
              Planimatik <span class="font-normal text-white/50">·</span> Centro de Incidencias
            </p>
            <p class="hidden text-[11px] text-white/55 sm:block">
              Comunicación informal → datos accionables
            </p>
          </div>
        </div>

        <nav class="flex items-center gap-1" aria-label="Secciones">
          <RouterLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            "
          >
            {{ item.label }}
            <span
              v-if="item.to === '/bandeja' && count"
              class="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[11px] font-semibold text-ink"
            >
              {{ count }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <RouterView />
    </main>
  </div>
</template>
