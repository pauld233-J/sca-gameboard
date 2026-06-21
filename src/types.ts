export interface GuildConfig {
  name: string;
  color: string;
  colorAlpha: string;
  emoji: string;
  initials: string;
}

export interface ExpeditionConfig {
  name: string;
  color: string;
  icon: string;
  badgeFile: string;
}

export interface Guild extends GuildConfig {
  identity: string;
  seasonTotal: number;
  standing: number;
  position: number;
}

export interface Expedition extends ExpeditionConfig {
  order: number;
  divisionName: string;
  status: 'Current' | 'Completed' | 'Locked';
  bossBattle: string;
  classProgress: number;
}
