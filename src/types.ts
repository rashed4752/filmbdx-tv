export interface Channel {
  id: string;
  name: string;
  logoUrl: string;
  streamUrl: string;
  streamType: string;
  isActive: boolean;
  addedAt: string;
  order?: number;
}

export interface DatabaseData {
  channels: Record<string, Channel>;
  prediction: any;
}

