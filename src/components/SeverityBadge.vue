<script setup lang="ts">
import { computed } from 'vue'
import { GRAVEDAD_LABEL, type Severity } from '../types'

const props = defineProps<{ gravedad: Severity; dot?: boolean }>()

const styles: Record<Severity, string> = {
  baja: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  media: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  alta: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  critica: 'bg-red-50 text-red-700 ring-red-600/20',
}
const dotColor: Record<Severity, string> = {
  baja: 'bg-emerald-500',
  media: 'bg-amber-500',
  alta: 'bg-orange-500',
  critica: 'bg-red-500',
}

const cls = computed(() => styles[props.gravedad])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
    :class="cls"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full" :class="dotColor[gravedad]" />
    {{ GRAVEDAD_LABEL[gravedad] }}
  </span>
</template>
