import { Link, usePage } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import blog from '@/routes/blog';
import contact from '@/routes/contact';
import jobs from '@/routes/jobs';
import legal from '@/routes/legal';
import pages from '@/routes/pages';
import services from '@/routes/services';
import type { SiteSettings } from '@/types';

export function SiteFooter() {
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;

    const socialLinks = [
        { href: siteSettings.facebook_url, icon: Facebook, label: 'Facebook' },
        { href: siteSettings.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
        { href: siteSettings.twitter_url, icon: Twitter, label: 'Twitter' },
        {
            href: siteSettings.instagram_url,
            icon: Instagram,
            label: 'Instagram',
        },
    ].filter((link) => link.href);

    return (
        <footer className="relative bg-muted/30">
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            />
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link href={home()} className="inline-flex">
                            <AppLogo />
                        </Link>
                        {siteSettings.footer_note && (
                            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                                {siteSettings.footer_note}
                            </p>
                        )}
                        {socialLinks.length > 0 && (
                            <div className="mt-4 flex gap-3">
                                {socialLinks.map(
                                    ({ href, icon: SocialIcon, label }) => (
                                        <a
                                            key={label}
                                            href={href ?? '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={label}
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <SocialIcon className="size-5" />
                                        </a>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Explore
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href={pages.about()}
                                    className="hover:text-foreground"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={services.index()}
                                    className="hover:text-foreground"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={jobs.index()}
                                    className="hover:text-foreground"
                                >
                                    Open Shifts
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={blog.index()}
                                    className="hover:text-foreground"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            Contact
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {siteSettings.address && (
                                <li>{siteSettings.address}</li>
                            )}
                            {siteSettings.phone && (
                                <li>
                                    <a
                                        href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}
                                        className="hover:text-foreground"
                                    >
                                        {siteSettings.phone}
                                    </a>
                                </li>
                            )}
                            {siteSettings.email && (
                                <li>
                                    <a
                                        href={`mailto:${siteSettings.email}`}
                                        className="hover:text-foreground"
                                    >
                                        {siteSettings.email}
                                    </a>
                                </li>
                            )}
                            <li>
                                <Link
                                    href={contact.show()}
                                    className="hover:text-foreground"
                                >
                                    Contact Form
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()}{' '}
                        {siteSettings.business_name ??
                            siteSettings.business_short_name}
                        . All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href={legal.privacy()}
                            className="hover:text-foreground"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={legal.terms()}
                            className="hover:text-foreground"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
