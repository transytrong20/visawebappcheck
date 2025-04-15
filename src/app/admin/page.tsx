"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: {
    edges: Array<{
      node: {
        src: string;
        altText: string | null;
      };
    }>;
  };
}

interface ProductImage {
  url: string;
  alt: string;
}

export default function AdminPanel() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    images: [] as ProductImage[],
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentImageAlt, setCurrentImageAlt] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          query: `
            query {
              products(first: 20) {
                edges {
                  node {
                    id
                    title
                    description
                    tags
                    productType
                    images(first: 10) {
                      edges {
                        node {
                          src
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
        },
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      const productData = response.data.data.products.edges.map((edge: any) => edge.node);
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (currentImageUrl) {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, { url: currentImageUrl, alt: currentImageAlt }],
      });
      setCurrentImageUrl('');
      setCurrentImageAlt('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewProduct({
      ...newProduct,
      images: newProduct.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          query: `
            mutation createProduct($input: ProductInput!) {
              productCreate(input: $input) {
                product {
                  id
                  title
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              title: newProduct.title,
              descriptionHtml: newProduct.description,
              productType: newProduct.category,
              tags: newProduct.tags.split(',').map(tag => tag.trim()),
              images: newProduct.images.map(img => ({
                src: img.url,
                altText: img.alt,
              })),
            },
          },
        },
        {
          headers: {
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      setNewProduct({
        title: '',
        description: '',
        category: '',
        tags: '',
        images: [],
      });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#204189] text-white py-5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {language === 'en' ? 'Admin Panel' : '管理面板'}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-1 rounded-md ${
                  language === 'en' ? 'bg-white text-[#204189]' : 'bg-transparent text-white border border-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={`px-4 py-1 rounded-md ${
                  language === 'zh' ? 'bg-white text-[#204189]' : 'bg-transparent text-white border border-white'
                }`}
              >
                中文
              </button>
              <Button
                onClick={() => router.push('/')}
                className="ml-4 bg-[#f6970f] hover:bg-[#e58a0a]"
              >
                {language === 'en' ? 'Back to Search' : '返回搜索'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Add Product Form */}
        <section className="mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Add New Product' : '新增產品'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">
                {language === 'en' ? 'Product Title' : '產品名稱'}
              </label>
              <input
                type="text"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">
                {language === 'en' ? 'Description' : '產品描述'}
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full h-32"
                required
              />
            </div>

            <div>
              <label className="block mb-1">
                {language === 'en' ? 'Category' : '產品類別'}
              </label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block mb-1">
                {language === 'en' ? 'Tags (comma-separated)' : '標籤（用逗號分隔）'}
              </label>
              <input
                type="text"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                placeholder={language === 'en' ? 'tag1, tag2, tag3' : '標籤1, 標籤2, 標籤3'}
              />
            </div>

            <div className="space-y-4">
              <label className="block mb-1">
                {language === 'en' ? 'Product Images' : '產品圖片'}
              </label>
              
              {/* Image Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  placeholder={language === 'en' ? 'Image URL' : '圖片網址'}
                  className="border border-gray-300 rounded-md px-4 py-2 flex-1"
                />
                <input
                  type="text"
                  value={currentImageAlt}
                  onChange={(e) => setCurrentImageAlt(e.target.value)}
                  placeholder={language === 'en' ? 'Alt Text' : '圖片描述'}
                  className="border border-gray-300 rounded-md px-4 py-2 w-1/3"
                />
                <Button type="button" onClick={handleAddImage}>
                  {language === 'en' ? 'Add' : '添加'}
                </Button>
              </div>

              {/* Image Preview */}
              <div className="grid grid-cols-2 gap-4">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? language === 'en'
                  ? 'Adding...'
                  : '新增中...'
                : language === 'en'
                ? 'Add Product'
                : '新增產品'}
            </Button>
          </form>
        </section>

        {/* Product List */}
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Existing Products' : '現有產品'}
          </h2>
          {loading && <p className="text-center">{language === 'en' ? 'Loading...' : '加載中...'}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-md shadow">
                <h3 className="font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.images.edges.map((edge, index) => (
                    <Image
                      key={index}
                      src={edge.node.src}
                      alt={edge.node.altText || product.title}
                      width={200}
                      height={200}
                      className="object-cover w-full h-32 rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white py-4 text-center text-gray-600 border-t">
        <p>© 2024 {language === 'en' ? 'Product Management System' : '產品管理系統'}</p>
      </footer>
    </div>
  );
} 