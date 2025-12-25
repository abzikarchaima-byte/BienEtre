import { PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth?.user;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <span className="text-xl font-bold text-gray-800">
                                        BienÊtre
                                    </span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
                                >
                                    Tableau de bord
                                </Link>
                                <Link
                                    href="/habits"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
                                >
                                    Habitudes
                                </Link>
                                <Link
                                    href="/journal"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
                                >
                                    Journal
                                </Link>
                                <Link
                                    href="/statistics"
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none"
                                >
                                    Statistiques
                                </Link>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        {user?.name}
                                    </span>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-sm text-gray-700 underline hover:text-gray-900"
                                    >
                                        Déconnexion
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}