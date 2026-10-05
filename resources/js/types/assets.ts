export type AssetFile = {
    path: string;
    size: number;
    last_modified_at: string;
    status: 'in_use' | 'legacy';
    used_by: string | null;
    type: 'image' | 'document' | 'other';
};

export type AssetCounts = {
    total: number;
    in_use: number;
    legacy: number;
    by_type: Record<'image' | 'document' | 'other', number>;
};

export type AssetDeleteResult = {
    path: string;
    deleted: boolean;
    reason: 'in_use' | 'not_found' | null;
    used_by: string | null;
};
