import slots from './image-slots.json'

export type ImgKey = keyof typeof slots

// A slot owns its source, even when two slots currently select the same file.
// Editing one entry never redirects an unrelated section to a different image.
export const IMG = Object.fromEntries(
  Object.entries(slots).map(([key, slot]) => [
    key,
    `/images/site/${slot.source.replace(/\.(?:png|jpe?g)$/i, `-${slot.width}.webp`)}`,
  ]),
) as Record<ImgKey, string>

export const mosaic: ImgKey[] = [
  'hero01', 'hero02', 'hero03', 'hero04', 'hero05',
  'hero06', 'hero07', 'hero08', 'hero09',
]

export const showreelImages: ImgKey[] = [
  'showreel01', 'showreel02', 'showreel03', 'showreel04', 'showreel05',
  'showreel06', 'showreel07', 'showreel08', 'showreel09',
]
