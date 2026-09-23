<script setup lang="ts">
import { computed } from 'vue'
import { TIPO_LABEL, TIPO_ICON, type TriageResult } from '../types'
import SeverityBadge from './SeverityBadge.vue'

const props = defineProps<{ result: TriageResult | null; loading: boolean }>()
const emit = defineEmits<{ add: [] }>()

const pct = computed(() => (props.result ? Math.round(props.result.confianza * 100) : 0))
</script>

<template>
  <section
    class="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6"
    aria-label="Resultado del triaje"
    aria-live="polite"
  >
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="font-display text-lg font-semibold text-ink">Incidencia estructurada</h2>
      <span
        v-if="result"
        class="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
        :class="
          result.fuente === 'ia'
            ? 'bg-teal/10 text-teal-600'
            : 'bg-slate-100 text-muted'
        "
      >
        {{ result.fuente === 'ia' ? 'Gemini' : 'Clasificador local' }}
      </span>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="flex flex-1 flex-col justify-center gap-3 py-8">
      <div class="h-4 w-1/3 animate-pulse rounded bg-line" />
      <div class="h-10 w-full animate-pulse rounded bg-line" />
      <div class="h-4 w-2/3 animate-pulse rounded bg-line" />
    </div>

    <!-- Vacío -->
    <div
      v-else-if="!result"
      class="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center"
    >
      <div class="grid h-12 w-12 place-items-center rounded-xl bg-canvas text-2xl">📋</div>
      <p class="max-w-[24ch] text-sm text-muted">
        Analiza un mensaje y aquí verás la incidencia clasificada, lista para la bandeja.
      </p>
    </div>

    <!-- Resultado -->
    <div v-else class="flex flex-1 flex-col gap-4">
      <div class="flex items-center gap-3">
        <div class="grid h-11 w-11 place-items-center rounded-xl bg-ink text-xl">
          <span aria-hidden="true">{{ TIPO_ICON[result.tipo] }}</span>
        </div>
        <div>
          <p class="font-display text-lg font-semibold leading-tight text-ink">
            {{ TIPO_LABEL[result.tipo] }}
          </p>
          <div class="mt-1 flex items-center gap-2">
            <SeverityBadge :gravedad="result.gravedad" dot />
            <span v-if="result.envioId" class="font-mono text-xs text-muted">
              envío {{ result.envioId }}
            </span>
          </div>
        </div>
      </div>

      <dl class="grid gap-3 rounded-xl bg-canvas p-4">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-muted">Resumen</dt>
          <dd class="mt-0.5 text-sm text-ink">{{ result.resumen }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-muted">
            Acción sugerida
          </dt>
          <dd class="mt-0.5 flex items-start gap-2 text-sm text-ink">
            <span class="mt-0.5 text-gold" aria-hidden="true">➜</span>
            <span>{{ result.accionSugerida }}</span>
          </dd>
        </div>
      </dl>

      <div>
        <div class="mb-1 flex items-center justify-between text-xs text-muted">
          <span>Confianza</span>
          <span class="font-mono font-medium text-ink">{{ pct }}%</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div class="h-full rounded-full bg-teal" :style="{ width: pct + '%' }" />
        </div>
      </div>

      <button
        type="button"
        class="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-teal bg-teal/5 px-4 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        @click="emit('add')"
      >
        Añadir a la bandeja
      </button>
    </div>
  </section>
</template>
