import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function Index({ auth, materials, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(route('raw-materials.index'), { search: query }, {
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
        if (confirm('¿Estás seguro de eliminar este material?')) {
            router.delete(route('raw-materials.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Materia Prima</h2>}
        >
            <Head title="Materia Prima" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center flex-1 gap-4">
                                    <h3 className="text-lg font-medium">Lista de Materias Primas</h3>
                                    <div className="flex-1 max-w-md">
                                        <input
                                            type="text"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            placeholder="Buscar por código, nombre, descripción o proveedor..."
                                            value={search}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </div>
                                <Link
                                    href={route('raw-materials.create')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Nuevo Material
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {materials?.map((material) => (
                                            <tr key={material.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{material.code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`${material.current_stock <= material.min_stock ? 'text-red-600 font-bold' : ''}`}>
                                                        {material.current_stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{material.unit_measure}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">${material.unit_price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        material.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {material.status === 'active' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('raw-materials.show', material.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <Link
                                                        href={route('raw-materials.edit', material.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(material.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {materials?.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                    No se encontraron materiales
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