import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function Index({ auth, products = [], filters = { search: '' } }) {
    const [search, setSearch] = useState(filters.search || '');
console.log(search)
    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(route('products.index'), { search: query }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            router.delete(route('products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Productos</h2>}
        >
            <Head title="Productos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center flex-1 gap-4">
                                    <h3 className="text-lg font-medium">Lista de Productos</h3>
                                    <div className="flex-1 max-w-md">
                                        <input
                                            type="text"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            placeholder="Buscar por código, nombre, descripción o categoría..."
                                            value={search}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </div>
                                <Link
                                    href={route('products.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Nuevo Producto
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products?.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{product.size}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`${product.current_stock <= product.min_stock ? 'text-red-600 font-bold' : ''}`}>
                                                        {product.current_stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('products.show', product.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={route('products.edit', product.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {products?.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                                    No se encontraron productos
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}