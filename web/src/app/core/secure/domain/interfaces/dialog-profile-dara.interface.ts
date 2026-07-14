export interface DialogProfileData {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
    onSaved?: () => void;
}
