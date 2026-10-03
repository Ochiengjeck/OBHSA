export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
};

export type SiteSettingRecord = {
    id: number;
    key: string;
    value: string | null;
    type: 'text' | 'textarea' | 'image' | 'url' | 'email' | 'phone';
    group: 'general' | 'contact' | 'social' | 'branding';
};

export type SiteSettings = {
    business_name?: string;
    business_short_name?: string;
    tagline?: string;
    address?: string;
    email?: string;
    phone?: string;
    logo_path?: string | null;
    facebook_url?: string | null;
    linkedin_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    footer_note?: string;
    [key: string]: string | null | undefined;
};

export type HeroSectionContent = {
    heading: string;
    subheading: string;
    image_path: string | null;
    primary_cta_label: string | null;
    primary_cta_url: string | null;
    secondary_cta_label: string | null;
    secondary_cta_url: string | null;
};

export type IntroSectionContent = {
    heading: string;
    body: string;
};

export type ServicesListSectionContent = {
    heading: string;
    subheading: string;
};

export type HowItWorksStep = {
    title: string;
    description: string;
};

export type HowItWorksSectionContent = {
    heading: string;
    steps: HowItWorksStep[];
};

export type FaqItem = {
    question: string;
    answer: string;
};

export type FaqSectionContent = {
    heading: string;
    items: FaqItem[];
};

export type CtaSectionContent = {
    heading: string;
    body: string;
    button_label: string;
    button_url: string;
    image_path: string | null;
};

export type FeatureShowcaseItem = {
    title: string;
    body: string;
    image_path: string | null;
};

export type FeatureShowcaseSectionContent = {
    heading: string;
    subheading: string;
    items: FeatureShowcaseItem[];
};

export type GalleryImage = {
    image_path: string | null;
    caption: string | null;
};

export type GallerySectionContent = {
    heading: string | null;
    images: GalleryImage[];
};

export type TestimonialsSectionContent = {
    heading: string;
};

export type StatsSectionContent = {
    heading: string;
};

export type ContactInfoSectionContent = {
    heading: string;
    body: string;
};

export type PageSectionType =
    | 'hero'
    | 'intro'
    | 'services_list'
    | 'how_it_works'
    | 'faq'
    | 'cta'
    | 'testimonials'
    | 'stats'
    | 'contact_info'
    | 'feature_showcase'
    | 'gallery';

export type Page = {
    id: number;
    slug: string;
    title: string;
    meta_description: string | null;
    is_published: boolean;
};

export type PageSection = {
    id: number;
    type: PageSectionType;
    position: number;
    is_visible: boolean;
    content:
        | HeroSectionContent
        | IntroSectionContent
        | ServicesListSectionContent
        | HowItWorksSectionContent
        | FaqSectionContent
        | CtaSectionContent
        | TestimonialsSectionContent
        | StatsSectionContent
        | ContactInfoSectionContent
        | FeatureShowcaseSectionContent
        | GallerySectionContent;
};

export type Service = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    description: string | null;
    icon: string | null;
    image_path: string | null;
    position: number;
    is_active: boolean;
};

export type JobListing = {
    id: number;
    title: string;
    slug: string;
    specialty: string;
    employment_type: string;
    location_city: string;
    location_state: string;
    shift: string | null;
    pay_range_min: string | null;
    pay_range_max: string | null;
    description: string;
    requirements: string | null;
    image_path: string | null;
    is_active: boolean;
    posted_at: string | null;
    closes_at: string | null;
};

export type BlogPost = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    featured_image_path: string | null;
    is_published: boolean;
    published_at: string | null;
};

export type Testimonial = {
    id: number;
    author_name: string;
    author_role: string | null;
    author_photo_path: string | null;
    quote: string;
    rating: number | null;
    position: number;
    is_featured: boolean;
};

export type StaffUser = {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
};

export type Stat = {
    id: number;
    label: string;
    value: string;
    icon: string | null;
    position: number;
    is_active: boolean;
};
