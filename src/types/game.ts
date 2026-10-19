export type CollectibleType = 'pearl' | 'dallah' | 'date' | 'falcon' | 'lantern' | 'coin';

export interface CollectibleItem {
  id: string;
  type: CollectibleType;
  name: string;
  points: number;
  x: number;
  y: number;
  z: number;
  emoji: string;
  color: string;
  culturalFact: string;
  collected: boolean;
}

export interface RemotePlayer {
  id: string;
  displayName: string;
  avatarColor: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  currentEmote?: string;
  emoteExpiresAt?: number;
}

export interface PlayerStats {
  score: number;
  pearlsCollected: number;
  totalPearls: number;
  itemsUnlocked: string[]; // ids
  districtRank: string;
}

export type TravelEmote = 'Hello! 👋' | 'Let\'s Go! 🚀' | 'Photo Spot! 📸' | 'Follow Me! 🗺️' | 'Marhaba! 👋' | 'Yalla! 🚀' | 'Karak Tea? ☕';
