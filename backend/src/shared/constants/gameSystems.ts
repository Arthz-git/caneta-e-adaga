export const gameSystemValues = ['DND5E', 'VAMPIRO_A_MASCARA', 'LIVRE'] as const

export type GameSystemValue = (typeof gameSystemValues)[number]
