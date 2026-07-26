import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 9h2v6H3V9Zm16 0h2v6h-2V9ZM6 7h3v10H6V7Zm9 0h3v10h-3V7ZM9 11h6v2H9v-2Z"
            />
        </svg>
    );
}
