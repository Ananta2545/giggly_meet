"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Info, LogOut, Moon, Plus, Sun, Video, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useState } from 'react';

const Header = () => {
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    // ✅ Debugging session and image
    console.log("Header - Session object:", session);
    console.log("Header - Image URL:", session?.user?.image);

    const formatTimeDate = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const userPlaceHolder = session?.user?.name?.split(" ").map((name) => name[0]).join("") || "U";

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/user-auth' });
    };

    return (
        <div className='flex items-center justify-between px-6 py-4 bg-white dark:bg-violet-950 border-b border-gray-200 dark:border-violet-700 shadow-md dark:shadow-violet-900'>
            <div className='flex items-center space-x-4'>
                <Link href='/' className='flex items-center space-x-2'>
                <div className="flex items-center gap-2 group transition-all duration-300 hover:scale-105 hover:rotate-1">
                    <Video className="w-10 h-10 text-pink-500 drop-shadow-md animate-bounce-slow group-hover:animate-spin-slow" />
                    <span className="hidden md:block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-emerald-400 animate-text-glow">
                        Giggly Meet
                    </span>
                </div>

                </Link>
            </div>
            <div className='flex items-center space-x-4'>
                <span className='text-sm italic text-gray-500 dark:text-violet-200'>
                   It's {formatTimeDate()} somewhere!
                </span>
                <Button
                    className='dark:border-white border-black cursor-pointer'
                    variant='ghost'
                    size='icon'
                    onClick={() => setTheme(theme === 'dark' ? "light" : 'dark')}
                >
                    {theme === 'dark' ? (
                        <Sun className='w-5 h-5 text-orange-400 hover:scale-110 transition-transform' />
                    ) : (
                        <Moon className='w-5 h-5 text-blue-600 hover:scale-110 transition-transform' />
                    )}
                </Button>
                <Button variant='ghost' size='icon' className='hidden md:block'>
                    <Info className='w-5 h-5 ml-2 text-gray-500 dark:text-violet-300' />
                </Button>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <Avatar className='cursor-pointer border-2 border-pink-400 dark:border-yellow-400'>
                            {session?.user?.image ? (
                                <>
                                    {console.log("Rendering AvatarImage with:", session.user.image)}
                                    <AvatarImage
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        onError={(e) => {
                                            console.error("Image load failed:", e);
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    {console.log("Rendering AvatarFallback with:", userPlaceHolder)}
                                    <AvatarFallback className='text-lg bg-gray-200 dark:bg-violet-300 dark:text-violet-900'>
                                        {userPlaceHolder}
                                    </AvatarFallback>
                                </>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end' className='w-80 p-4 bg-white dark:bg-violet-900 rounded-xl shadow-xl dark:shadow-violet-800 border dark:border-violet-700'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-bold text-gray-800 dark:text-white'>
                                {session?.user?.email}
                            </span>
                            <Button className='cursor-pointer rounded-full p-2' variant='ghost' size='icon' onClick={() => setOpen(false)}>
                                <X className='h-5 w-5 text-gray-500 dark:text-white' />
                            </Button>
                        </div>
                        <div className='flex flex-col items-center mb-4'>
                            <Avatar className='w-20 h-20 mb-2 cursor-pointer border-2 border-emerald-400'>
                                {session?.user?.image ? (
                                    <AvatarImage
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        onError={(e) => {
                                            console.error("Large Avatar Image load failed:", e);
                                        }}
                                    />
                                ) : (
                                    <AvatarFallback className='text-2xl bg-gray-200 dark:bg-violet-300 dark:text-violet-900'>
                                        {userPlaceHolder}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <h1 className='text-xl font-semibold mt-2 text-center text-gray-700 dark:text-white'>
                                Yo, {session?.user?.name} 👋
                            </h1>
                            <p className='text-sm text-gray-400 dark:text-violet-300'>
                                You're looking fabulous today!
                            </p>
                        </div>
                        <div className='flex mb-4'>
                            <Button className='cursor-pointer w-1/2 h-14 rounded-l-full dark:border-violet-700' variant='outline'>
                                <Plus className='h-4 w-4 mr-2' />
                                Clone me 
                            </Button>
                            <Button className='cursor-pointer w-1/2 h-14 rounded-r-full dark:border-violet-700' variant='outline' onClick={handleLogout}>
                                <LogOut className='h-4 w-4 mr-2' />
                                Peace Out
                            </Button>
                        </div>
                        <div className='text-center text-xs text-gray-500 dark:text-violet-300'>
                            <Link href='#' className='hover:bg-gray-200 dark:hover:bg-violet-700 p-2 rounded-lg'>
                                Privacy Shenanigans
                            </Link>
                            {" . "}
                            <Link href='#' className='hover:bg-gray-200 dark:hover:bg-violet-700 p-2 rounded-lg'>
                                Terms & Memes
                            </Link>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Header;
