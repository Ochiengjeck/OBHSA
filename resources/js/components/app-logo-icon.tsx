import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 2a1 1 0 0 0-1 1v6H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6v6a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6V3a1 1 0 0 0-1-1h-4Z"
            />
        </svg>
    );
}
