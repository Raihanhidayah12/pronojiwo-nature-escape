import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex">

                                {/* 🔹 Sidebar / Menu */}
                                {/* <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
                                    <h2 className="text-xl font-bold mb-6">Menu</h2>

                                    <ul className="space-y-3">
                                        <li>
                                            <Link href="/dashboard" className="hover:text-gray-300">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/product" className="hover:text-gray-300">
                                                Produk
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/profile" className="hover:text-gray-300">
                                                Profile
                                            </Link>
                                        </li>
                                    </ul>
                                </div> */}

                                {/* 🔹 Content */}
                                {/* <div className="flex-1 p-6 bg-gray-100">

                                    <h1 className="text-2xl font-bold mb-4">
                                        Halo, {auth.user.name}
                                    </h1>

                                    {/* 🔹 Button tambah */}
                                    {/* <div className="mb-4">
                                        <Link
                                            href="/product/create"
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            + Tambah Produk
                                        </Link>
                                    </div> */}

                                    {/* 🔹 Table */}
                                    {/* <div className="bg-white p-4 rounded shadow">
                                        <table className="w-full border">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="p-2 border">No</th>
                                                    <th className="p-2 border">Nama</th>
                                                    <th className="p-2 border">Harga</th>
                                                    <th className="p-2 border">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.length > 0 ? (
                                                    products.map((p, index) => (
                                                        <tr key={p.id}>
                                                            <td className="p-2 border">{index + 1}</td>
                                                            <td className="p-2 border">{p.name}</td>
                                                            <td className="p-2 border">{p.price}</td>
                                                            <td className="p-2 border space-x-2">
                                                                <Link
                                                                    href={`/product/${p.id}/edit`}
                                                                    className="text-blue-500"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <Link
                                                                    href={`/product/${p.id}`}
                                                                    method="delete"
                                                                    as="button"
                                                                    className="text-red-500"
                                                                >
                                                                    Hapus
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center p-4">
                                                            Data kosong
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
