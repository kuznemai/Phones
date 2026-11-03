<script setup lang="ts">
/**
 * Line icons used across the store. Decorative by default (`aria-hidden`); give the
 * surrounding control its accessible name instead.
 */
type IconName =
  | "boot"
  | "lock"
  | "sliders"
  | "eye"
  | "chip"
  | "refresh"
  | "key"
  | "apps"
  | "shield"
  | "box"
  | "truck"
  | "badge"
  | "info"
  | "check"
  | "arrow"
  | "arrow-left"
  | "search"
  | "filter"
  | "close"
  | "trash"
  | "mail";

defineProps<{ name: IconName }>();
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'boot'">
      <path d="M12 3 20 6v6c0 4.6-3.3 7.9-8 9-4.7-1.1-8-4.4-8-9V6l8-3Z" />
      <path d="m8.8 12.2 2.2 2.2 4.4-4.6" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7M12 14.5v2.5" />
    </template>
    <template v-else-if="name === 'sliders'">
      <path d="M4 7h9m4 0h3M4 17h3m4 0h9M15 5v4M9 15v4" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M3 12s3.3-6 9-6c2 0 3.6.7 5 1.7M21 12s-3.3 6-9 6c-2 0-3.6-.7-5-1.7" />
      <path d="M4 20 20 4" />
    </template>
    <template v-else-if="name === 'chip'">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <path d="M10 7V4m4 3V4m-4 16v-3m4 3v-3M7 10H4m3 4H4m16-4h-3m3 4h-3" />
    </template>
    <template v-else-if="name === 'refresh'">
      <path d="M19.5 12a7.5 7.5 0 0 1-13.1 5M4.5 12a7.5 7.5 0 0 1 13.1-5" />
      <path d="M17.8 3.5v3.7h-3.7M6.2 20.5v-3.7h3.7" />
    </template>
    <template v-else-if="name === 'key'">
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16.5 6.5l2 2M14.5 8.5l1.5 1.5" />
    </template>
    <template v-else-if="name === 'apps'">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3 20 6v6c0 4.6-3.3 7.9-8 9-4.7-1.1-8-4.4-8-9V6l8-3Z" />
    </template>
    <template v-else-if="name === 'box'">
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z" />
      <path d="m4 7.5 8 3.5 8-3.5M12 11v9" />
    </template>
    <template v-else-if="name === 'truck'">
      <path d="M3 6h11v10H3zM14 9.5h3.5L21 13v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </template>
    <template v-else-if="name === 'badge'">
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m9 14.3-1.5 6.2 4.5-2.3 4.5 2.3-1.5-6.2" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </template>
    <template v-else-if="name === 'check'">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </template>
    <template v-else-if="name === 'arrow'">
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </template>
    <template v-else-if="name === 'filter'">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12M18 6 6 18" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M5 7h14M10 7V5h4v2M7 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </template>
  </svg>
</template>
