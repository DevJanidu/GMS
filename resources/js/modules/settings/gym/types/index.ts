export type GymProfile = {
    legal_name: string | null;
    logo_path: string | null;
    logo_url: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    tax_id: string | null;
    website: string | null;
    description: string | null;
    tenant: {
        name: string;
        timezone: string;
        currency: string;
    };
};

export type GymProfileFormValues = {
    legal_name: string;
    address: string;
    city: string;
    country: string;
    contact_email: string;
    contact_phone: string;
    tax_id: string;
    website: string;
    description: string;
    logo: File | null;
};
