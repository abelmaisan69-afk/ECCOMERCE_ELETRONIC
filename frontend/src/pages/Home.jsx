import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const [productsResponse, categoriesResponse] =
                    await Promise.all([
                        api.get("/products"),
                        api.get("/categories"),
                    ]);

                setProducts(productsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error(error);

                setError("Gagal mengambil data");
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    const filteredProducts =
        selectedCategory === null
            ? products
            : products.filter(
                  (product) =>
                      product.category_id === selectedCategory
              );

    return (
        <main className="max-w-7xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Produk Elektronik
                </h1>

                <p className="text-gray-500 mt-2">
                    Temukan berbagai produk elektronik pilihan.
                </p>
            </div>

            {/* Categories */}
            <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">
                    Kategori
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-2">

                    {/* Semua */}
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`rounded-lg px-5 py-3 whitespace-nowrap ${
                            selectedCategory === null
                                ? "bg-black text-white"
                                : "bg-white border hover:bg-gray-100"
                        }`}
                    >
                        Semua
                    </button>

                    {/* Category dari database */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() =>
                                setSelectedCategory(category.id)
                            }
                            className={`rounded-lg px-5 py-3 whitespace-nowrap ${
                                selectedCategory === category.id
                                    ? "bg-black text-white"
                                    : "bg-white border hover:bg-gray-100"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}

                </div>
            </section>

            {/* Loading */}
            {loading && (
                <p className="text-gray-500">
                    Memuat produk...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500">
                    {error}
                </p>
            )}

            {/* Products */}
            {!loading && !error && (
                <section>

                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold">
                            {selectedCategory === null
                                ? "Semua Produk"
                                : categories.find(
                                      (category) =>
                                          category.id === selectedCategory
                                  )?.name}
                        </h2>

                        <span className="text-sm text-gray-500">
                            {filteredProducts.length} produk
                        </span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <p className="text-gray-500">
                            Belum ada produk di kategori ini.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}

                </section>
            )}

        </main>
    );
}

export default Home;