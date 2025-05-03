import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Product } from '../interfaces';
import { addProduct, updateProduct, getAllProducts } from '../utils/web3';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const InventoryPage: React.FC = () => {
  const { contract, account } = useWeb3();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductDescription, setNewProductDescription] = useState<string>('');
  const [newProductQuantity, setNewProductQuantity] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');

  const loadProducts = async () => {
    if (!contract || !account) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const productsData = await getAllProducts(contract, account);
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [contract, account]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !account) return;
    
    try {
      setError(null);
      
      if (!newProductName || !newProductQuantity || !newProductPrice) {
        setError('Please fill in all required fields');
        return;
      }
      
      await addProduct(
        contract,
        account,
        newProductName,
        newProductDescription,
        Number(newProductQuantity),
        Number(newProductPrice)
      );
      
      // Reset form
      setNewProductName('');
      setNewProductDescription('');
      setNewProductQuantity('');
      setNewProductPrice('');
      setShowAddProduct(false);
      
      // Reload products
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !account || !selectedProduct) return;
    
    try {
      setError(null);
      
      if (!newProductQuantity || !newProductPrice) {
        setError('Please fill in all required fields');
        return;
      }
      
      await updateProduct(
        contract,
        account,
        selectedProduct.id,
        Number(newProductQuantity),
        Number(newProductPrice)
      );
      
      // Reset form
      setNewProductQuantity('');
      setNewProductPrice('');
      setShowUpdateProduct(false);
      setSelectedProduct(null);
      
      // Reload products
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ padding: '1.5rem 0' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}>Inventory Management</h1>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <LoadingSpinner message="Loading inventory..." />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>Inventory Management</h1>
        <button
          onClick={() => setShowAddProduct(true)}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.backgroundColor = '#4338CA';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.backgroundColor = '#4F46E5';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#F3F4F6' }}>
            <tr>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Name</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Description</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'right', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Quantity</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'right', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Price</th>
              <th style={{ 
                padding: '1rem 1.5rem', 
                textAlign: 'right', 
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4B5563',
                borderBottom: '1px solid #E5E7EB'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id}
                style={{ 
                  borderBottom: '1px solid #E5E7EB'
                }}
              >
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {product.name}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  {product.description}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'right',
                  color: product.quantity <= 10 ? '#DC2626' : '#059669'
                }}>
                  {product.quantity}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textAlign: 'right',
                  color: '#374151'
                }}>
                  ₹{product.price.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '1rem 1.5rem', 
                  textAlign: 'right'
                }}>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setNewProductQuantity(product.quantity.toString());
                      setNewProductPrice(product.price.toString());
                      setShowUpdateProduct(true);
                    }}
                    style={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ 
                  padding: '3rem', 
                  textAlign: 'center',
                  color: '#6B7280'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" style={{ width: '3rem', height: '3rem', color: '#9CA3AF' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <div style={{ fontSize: '0.875rem' }}>No products found</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        title="Add New Product"
      >
        <form onSubmit={handleAddProduct}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Product Name *
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Enter product name"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Description
            </label>
            <textarea
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
              placeholder="Enter product description"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Quantity *
            </label>
            <input
              type="number"
              value={newProductQuantity}
              onChange={(e) => setNewProductQuantity(e.target.value)}
              placeholder="Enter quantity"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem'
              }}
              required
              min="0"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Price (₹) *
            </label>
            <input
              type="number"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              placeholder="Enter price"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem'
              }}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setShowAddProduct(false)}
              style={{
                backgroundColor: '#F3F4F6',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#4F46E5',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Add Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Product Modal */}
      <Modal
        isOpen={showUpdateProduct}
        onClose={() => setShowUpdateProduct(false)}
        title="Update Product"
      >
        <form onSubmit={handleUpdateProduct}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Product Name
            </label>
            <input
              type="text"
              value={selectedProduct?.name || ''}
              disabled
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem',
                backgroundColor: '#F3F4F6'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Quantity *
            </label>
            <input
              type="number"
              value={newProductQuantity}
              onChange={(e) => setNewProductQuantity(e.target.value)}
              placeholder="Enter quantity"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem'
              }}
              required
              min="0"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Price (₹) *
            </label>
            <input
              type="number"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              placeholder="Enter price"
              style={{
                width: '100%',
                padding: '0.625rem',
                borderRadius: '0.375rem',
                border: '1px solid #D1D5DB',
                fontSize: '0.875rem'
              }}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setShowUpdateProduct(false)}
              style={{
                backgroundColor: '#F3F4F6',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#4F46E5',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Update Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage; 