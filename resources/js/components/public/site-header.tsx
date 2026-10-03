import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { home } from '@/routes';
import blog from '@/routes/blog';
import contact from '@/routes/contact';
import jobs from '@/routes/jobs';
import pages from '@/routes/pages';
import services from '@/routes/services';
import type { Auth, NavItem } from '@/types';

const navItems: NavItem[] = [
    { title: 'About', href: pages.about() },
    { title: 'Services', href: services.index() },
    { title: 'For Facilities', href: pages.forFacilities() },
    { title: 'For Caregivers', href: pages.forCaregivers() },
    { title: 'Jobs', href: jobs.index() },
    { title: 'Blog', href: blog.index() },
];

export function SiteHeader() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    href={home()}
                    className="flex items-center gap-2"
                    prefetch
                >
                    <AppLogo />
                </Link>

                <nav className="hidden items-center gap-6 lg:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className={cn(
                                'relative py-1 text-sm font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100',
                                isCurrentUrl(item.href) &&
                                    'text-foreground after:scale-x-100',
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    {auth.user ? (
                        <Button asChild>
                            <Link href="/admin">Backoffice</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href={contact.show()}>Contact Us</Link>
                        </Button>
                    )}
                </div>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="size-5" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <SheetHeader>
                            <SheetTitle>
                                <Link
                                    href={home()}
                                    onClick={() => setOpen(false)}
                                >
                                    <AppLogo />
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                                        isCurrentUrl(item.href) &&
                                            'bg-muted text-foreground',
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                            <Link
                                href={
                                    auth.user ? '/admin' : toUrl(contact.show())
                                }
                                onClick={() => setOpen(false)}
                                className="mt-2 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
                            >
                                {auth.user ? 'Backoffice' : 'Contact Us'}
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
