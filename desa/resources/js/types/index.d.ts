export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'warga';
    avatar?: string;
    phone?: string;
    address?: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    type: 'event' | 'memory' | 'destination';
    description?: string;
}

export interface Event {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    event_date: string;
    end_date?: string;
    time?: string;
    location?: string;
    image?: string;
    status: 'draft' | 'published' | 'archived';
    category_id?: number;
    user_id: number;
    category?: Category;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Memory {
    id: number;
    title: string;
    description?: string;
    type: 'video' | 'photo';
    platform: 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'upload';
    source_url: string;
    embed_code?: string;
    thumbnail_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    category_id?: number;
    submitted_by: number;
    approved_by?: number;
    approved_at?: string;
    submitter?: User;
    approver?: User;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface Destination {
    id: number;
    name: string;
    slug: string;
    description?: string;
    content?: string;
    category: 'fasilitas' | 'wisata' | 'suasana';
    address?: string;
    latitude?: number;
    longitude?: number;
    featured_image?: string;
    status: 'draft' | 'published';
    user_id: number;
    images?: DestinationImage[];
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface DestinationImage {
    id: number;
    destination_id: number;
    image_path: string;
    caption?: string;
    order: number;
}

export interface VillageInfo {
    id: number;
    key: string;
    value?: string;
    group: string;
    label?: string;
    order: number;
}

export interface Poll {
    id: number;
    question: string;
    options: string[];
    votes: Record<number, number> | null;
    is_active: boolean;
    ends_at: string | null;
    user_id: number;
    user?: User;
    vote_counts?: Record<number, number>;
    total_votes?: number;
    created_at: string;
    updated_at: string;
}

export interface PollVote {
    id: number;
    poll_id: number;
    option_index: number;
    session_id: string;
    user_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
};
