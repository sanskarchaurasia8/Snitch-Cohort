import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const SellerProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant, handleUpdateVariantStock, handleDeleteVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  // Form state for new variant
  const [variantForm, setVariantForm] = useState({
    priceAmount: '',
    priceCurrency: 'INR',
    stock: '',
    attributes: { size: '', color: '' },
    images: []
  });

  const fetchProductDetail = async () => {
    try {
      setIsLoading(true);
      const data = await handleGetProductById(productId);
      console.log("API PRODUCT DATA:", data);
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const handleStockUpdate = async (variantId, newStock) => {
    try {
      await handleUpdateVariantStock(productId, variantId, newStock);
      // Update local state for immediate feedback
      setProduct(prev => ({
        ...prev,
        varients: prev.varients.map(v => v._id === variantId ? { ...v, stock: newStock } : v)
      }));
    } catch (error) {
      console.error("Failed to update stock", error);
    }
  };

  const handleRemoveVariant = async (variantId) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;
    try {
      await handleDeleteVariant(productId, variantId);
      setProduct(prev => ({
        ...prev,
        varients: prev.varients.filter(v => v._id !== variantId)
      }));
    } catch (error) {
      console.error("Failed to delete variant", error);
    }
  };

  const handleAddVariantSubmit = async (e) => {
    e.preventDefault();
    setIsAddingVariant(true);
    try {
      const formData = new FormData();
      formData.append('priceAmount', Number(variantForm.priceAmount));
      formData.append('priceCurrency', variantForm.priceCurrency);
      formData.append('stock', Number(variantForm.stock));

      // Send attributes as an object (stringified)
      formData.append('attributes', JSON.stringify(variantForm.attributes));

      if (variantForm.images && variantForm.images.length > 0) {
        Array.from(variantForm.images).forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await handleAddProductVariant(productId, formData);

      if (response.success) {
        setShowVariantModal(false);
        setProduct(response.product);

        setVariantForm({
          priceAmount: '',
          priceCurrency: 'INR',
          stock: '',
          attributes: { size: '', color: '' },
          images: []
        });
      }
    } catch (error) {
      console.error("Failed to add variant", error);
    } finally {
      setIsAddingVariant(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#F59E0B]/20 border-t-[#F59E0B] rounded-full animate-spin" />
          <span className="text-[#D8C3AD]/40 text-[10px] tracking-[0.3em] uppercase">Loading Details</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#D8C3AD]/40 mb-6">Product not found</p>
          <button onClick={() => navigate('/seller/dashboard')} className="text-[#F59E0B] text-xs tracking-widest uppercase">← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#E5E2E1] font-['Inter'] selection:bg-[#F59E0B]/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-[#F59E0B]/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate('/seller/dashboard')} className="flex items-center gap-3 text-[#D8C3AD]/60 hover:text-[#F59E0B] transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Dashboard</span>
          </button>
          <span className="text-[#F59E0B] font-bold tracking-[0.3em] text-xl">SNITCH</span>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Product Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#1C1B1B] border border-[#F59E0B]/5 shadow-2xl">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D8C3AD]/10">No Image</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.slice(1).map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-[#1C1B1B] border border-[#F59E0B]/5">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-[#F59E0B]/60 text-[10px] tracking-[0.3em] uppercase font-bold mb-4">Product Overview</p>
            <h1 className="text-5xl lg:text-6xl font-light tracking-tight mb-6 leading-tight">{product.title}</h1>
            <div className="w-12 h-px bg-[#F59E0B]/50 mb-8" />
            <p className="text-[#D8C3AD]/50 text-lg font-light leading-relaxed mb-10 max-w-lg">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-3xl font-semibold text-[#F59E0B]">₹{product.price?.amount}</span>
              <span className="text-xs tracking-widest text-[#D8C3AD]/40 uppercase">{product.price?.currency}</span>
            </div>

            <div className="flex flex-wrap gap-12 text-[10px] tracking-[0.2em] uppercase font-bold text-[#D8C3AD]/40">
              <div className="space-y-2">
                <p className="text-[#F59E0B]/30">Created</p>
                <p className="text-[#E5E2E1]">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[#F59E0B]/30">Variants</p>
                <p className="text-[#E5E2E1]">{product.varients?.length || 0} Types</p>
              </div>
            </div>
          </div>
        </section>

        {/* Variants Management */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">Product <span className="text-[#F59E0B] font-semibold">Variants</span></h2>
              <p className="text-[#D8C3AD]/30 text-xs tracking-widest uppercase">Manage stock and pricing for each variation</p>
            </div>
            <button
              onClick={() => setShowVariantModal(true)}
              className="bg-[#F59E0B] text-[#472A00] px-8 py-4 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] transition-all active:scale-95"
            >
              Add New Variant
            </button>
          </div>

          {product.varients?.length === 0 ? (
            <div className="bg-[#1C1B1B] rounded-[2rem] py-24 flex flex-col items-center justify-center text-center border border-[#F59E0B]/5">
              <div className="w-16 h-16 rounded-full bg-[#F59E0B]/5 flex items-center justify-center mb-8 text-[#F59E0B]/20">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <h3 className="text-xl font-light mb-4">No variants created yet</h3>
              <p className="text-[#D8C3AD]/30 text-sm max-w-xs mb-10">Create variants to define different sizes, colors and manage their independent stock levels.</p>
              <button onClick={() => setShowVariantModal(true)} className="text-[#F59E0B] text-[10px] tracking-[0.2em] uppercase font-bold border-b border-[#F59E0B]/20 pb-1 hover:border-[#F59E0B] transition-all">Start Creating</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {product.varients.map((v) => (
                <div key={v._id} className="group bg-[#1C1B1B] rounded-[2rem] p-8 border border-[#F59E0B]/5 hover:border-[#F59E0B]/20 transition-all duration-500">
                  <div className="flex gap-6 mb-8">
                    <div className="w-24 h-32 rounded-2xl bg-[#2A2A2A] overflow-hidden flex-shrink-0">
                      {v.images?.[0] ? (
                        <img src={v.images[0].url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#D8C3AD]/5 text-[10px]">No IMG</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold">Attributes</p>
                        <div className="flex flex-wrap gap-2">
                          {v.attributes && (
                            Array.isArray(v.attributes) ? (
                              v.attributes.map((attr, idx) => (
                                <span key={idx} className="bg-[#2A2A2A] text-[#E5E2E1] px-3 py-1 rounded-full text-[10px] font-medium border border-[#F59E0B]/5 capitalize">
                                  {attr.key}: {attr.value}
                                </span>
                              ))
                            ) : (
                              Object.entries(v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes).map(([key, val]) => (
                                <span key={key} className="bg-[#2A2A2A] text-[#E5E2E1] px-3 py-1 rounded-full text-[10px] font-medium border border-[#F59E0B]/5 capitalize">
                                  {key}: {val}
                                </span>
                              ))
                            )
                          )}
                        </div>
                      </div>
                      <div className="text-xl font-semibold text-[#F59E0B]">₹{v.price?.amount}</div>
                    </div>
                  </div>

                  <div className="bg-[#131313]/50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#D8C3AD]/30 font-bold">Stock Management</span>
                      <span className={`w-2 h-2 rounded-full ${v.stock > 10 ? 'bg-emerald-500' : v.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'} shadow-[0_0_10px_currentColor]`} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleStockUpdate(v._id, Math.max(0, v.stock - 1))}
                        className="w-10 h-10 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-[#D8C3AD]/40 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all active:scale-90"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      </button>
                      <div className="flex-1 text-center font-mono text-2xl font-bold">{v.stock}</div>
                      <button
                        onClick={() => handleStockUpdate(v._id, v.stock + 1)}
                        className="w-10 h-10 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-[#D8C3AD]/40 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all active:scale-90"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveVariant(v._id)}
                    className="w-full mt-6 py-3 rounded-xl border border-rose-500/10 text-rose-500/40 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-rose-500/5 hover:text-rose-500 transition-all"
                  >
                    Delete Variant
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-[#0E0E0E]/90 backdrop-blur-md" onClick={() => setShowVariantModal(false)} />
          <div className="relative bg-[#1C1B1B] w-full max-w-xl rounded-[2.5rem] p-10 border border-[#F59E0B]/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-light tracking-tight">Create <span className="text-[#F59E0B] font-semibold">Variant</span></h2>
              <button onClick={() => setShowVariantModal(false)} className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#D8C3AD]/40 hover:text-[#F59E0B] transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddVariantSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold ml-1">Size</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. XL"
                    className="w-full bg-[#131313] border border-[#F59E0B]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B]/40 transition-all placeholder:text-[#D8C3AD]/10"
                    value={variantForm.attributes.size}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, attributes: { ...prev.attributes, size: e.target.value } }))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold ml-1">Color</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noir"
                    className="w-full bg-[#131313] border border-[#F59E0B]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B]/40 transition-all placeholder:text-[#D8C3AD]/10"
                    value={variantForm.attributes.color}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, attributes: { ...prev.attributes, color: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold ml-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    className="w-full bg-[#131313] border border-[#F59E0B]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B]/40 transition-all placeholder:text-[#D8C3AD]/10"
                    value={variantForm.priceAmount}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, priceAmount: e.target.value }))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold ml-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    className="w-full bg-[#131313] border border-[#F59E0B]/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#F59E0B]/40 transition-all placeholder:text-[#D8C3AD]/10"
                    value={variantForm.stock}
                    onChange={(e) => setVariantForm(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#F59E0B]/40 font-bold ml-1">Variant Images</label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setVariantForm(prev => ({ ...prev, images: e.target.files }))}
                  />
                  <div className="w-full bg-[#131313] border border-dashed border-[#F59E0B]/10 rounded-2xl py-10 flex flex-col items-center justify-center transition-all group-hover:border-[#F59E0B]/30">
                    <svg className="w-6 h-6 text-[#F59E0B]/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-[10px] tracking-widest text-[#D8C3AD]/30 uppercase font-bold">
                      {variantForm.images.length > 0 ? `${variantForm.images.length} Files Selected` : 'Click to upload variant photos'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled={isAddingVariant}
                className="w-full bg-gradient-to-r from-[#FFC174] to-[#F59E0B] text-[#472A00] py-5 rounded-2xl text-[10px] tracking-[0.3em] uppercase font-bold shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingVariant ? 'Processing...' : 'Create Variant'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerProductDetails