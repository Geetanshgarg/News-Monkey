"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Newspaper, Keyboard, LayoutDashboard, Settings, Info } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Practice', href: '/practice' as any, icon: Keyboard },
        { name: 'Dashboard', href: '/dashboard' as any, icon: LayoutDashboard },
        { name: 'Settings', href: '/settings' as any, icon: Settings },
        { name: 'About', href: '/about' as any, icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" as="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/20">
                        <Newspaper className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        News<span className="text-primary">Type</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === (item.href as string);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
