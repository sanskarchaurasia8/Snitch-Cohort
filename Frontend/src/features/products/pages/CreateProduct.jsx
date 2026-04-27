import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

/**
 * CreateProduct Page — Snitch Clothing Platform
 * Responsive: single-column on mobile → two-panel horizontal on desktop.
 * Theme: Aurelian Noir — Golden Yellow (#F59E0B) on Deep Dark (#0D0D0D).
 * Styled with TailwindCSS v4.
 */
const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreatProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const MAX_IMAGES = 7;

  // ── Form handlers ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Image handlers ───────────────────────────────────────────────────────
  const addImages = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const newImages = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random()}`,
        }));
      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length]
  );

  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) {
      addImages(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addImages(e.dataTransfer.files);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("priceAmount", formData.priceAmount);
      payload.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => payload.append("images", img.file));
      await handleCreatProduct(payload);
      navigate("/");
    } catch (err) {
      console.error("Create product failed:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared field style ───────────────────────────────────────────────────
  const fieldWrap = "border-b border-[#534434]/30 focus-within:border-[#F59E0B] transition-colors duration-500";
  const metaLabel = "block text-[#D8C3AD]/30 text-[9px] tracking-[0.3em] uppercase font-medium mb-3";

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-['Inter'] relative overflow-x-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#F59E0B]/[0.05] blur-[180px] rounded-full" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#F59E0B]/[0.03] blur-[140px] rounded-full" />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#F59E0B]/[0.06]">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 xl:px-20 py-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#D8C3AD]/50 hover:text-[#F59E0B] transition-colors duration-300 group"
            aria-label="Go back"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Back</span>
          </button>

          <span className="text-white font-bold tracking-[0.25em] text-lg lg:text-xl">SNITCH</span>
          <div className="w-16" />
        </div>
      </nav>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-6 sm:px-10 xl:px-20 py-12 lg:py-16">

        {/* Page header */}
        <header className="mb-12 lg:mb-16">
          <p className="text-[#D8C3AD]/40 text-[10px] tracking-[0.25em] uppercase font-medium mb-3">
            New Listing
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.05]">
            Create <span className="font-semibold text-[#F59E0B]">Product</span>
          </h1>
          <div className="w-12 h-[1.5px] bg-[#F59E0B]/50 mt-5 rounded-full" />
        </header>

        {/* ── Responsive Form Grid ─────────────────────────────────────── */}
        {/* Mobile: single column | Desktop lg+: two-panel side by side    */}
        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-5 lg:gap-16 xl:gap-24">

            {/* ════════════════════════════════════════════════════════════
                LEFT PANEL — Title + Description  (col-span-3)
                ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-3 space-y-12 mb-14 lg:mb-0">

              {/* Section label */}
              <p className={metaLabel}>Product Info</p>

              {/* Title */}
              <div className={fieldWrap}>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Product Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-transparent pt-4 pb-5 pl-1 text-white placeholder-[#D8C3AD]/20 outline-none text-2xl sm:text-3xl xl:text-4xl font-light tracking-tight"
                />
              </div>

              {/* Description */}
              <div className={fieldWrap}>
                <label htmlFor="description" className={metaLabel}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe your product — materials, fit, care instructions..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full bg-transparent pt-3 pb-5 pl-1 text-white/90 placeholder-[#D8C3AD]/20 outline-none text-base lg:text-lg font-light leading-relaxed resize-none"
                />
              </div>

              {/* ── On desktop: vertical separator line on right edge ── */}
              {/* purely decorative, done via the grid gap */}
            </div>

            {/* ════════════════════════════════════════════════════════════
                RIGHT PANEL — Pricing + Images + Submit  (col-span-2)
                ════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* Vertical accent line on LG+ (left edge of right panel) */}
              <div className="hidden lg:block absolute left-0 top-0 h-full w-[1px]" />

              {/* ── Pricing ─────────────────────────────────────────── */}
              <section className="space-y-8">
                <p className={metaLabel}>Pricing</p>

                {/* Amount */}
                <div className={fieldWrap}>
                  <label htmlFor="priceAmount" className={metaLabel}>Amount</label>
                  <input
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    className="w-full bg-transparent pt-3 pb-5 pl-1 text-white placeholder-[#D8C3AD]/20 outline-none text-3xl xl:text-4xl font-light tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Currency */}
                <div className={fieldWrap}>
                  <label htmlFor="priceCurrency" className={metaLabel}>Currency</label>
                  <div className="relative pb-4">
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-transparent pt-3 pb-5 pl-1 text-white outline-none text-xl font-light tracking-tight appearance-none cursor-pointer pr-6"
                    >
                      <option value="USD" className="bg-[#1C1B1B]">USD — US Dollar</option>
                      <option value="EUR" className="bg-[#1C1B1B]">EUR — Euro</option>
                      <option value="GBP" className="bg-[#1C1B1B]">GBP — British Pound</option>
                      <option value="INR" className="bg-[#1C1B1B]">INR — Indian Rupee</option>
                    </select>
                    <svg className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#D8C3AD]/30"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </section>

              {/* ── Images ──────────────────────────────────────────── */}
              <section className="space-y-5">
                <div className="flex items-baseline justify-between">
                  <p className={metaLabel}>Product Images</p>
                  <span className="text-[#D8C3AD]/20 text-[10px] tracking-widest">
                    {images.length} / {MAX_IMAGES}
                  </span>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  aria-label="Upload product images"
                />

                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-2xl p-5 transition-colors duration-300 ${
                    isDragging
                      ? "bg-[#F59E0B]/[0.06] border border-[#F59E0B]/20"
                      : "bg-[#1C1B1B]/60"
                  }`}
                >
                  {images.length < MAX_IMAGES && (
                    <p className="text-center text-[#D8C3AD]/20 text-[10px] tracking-widest uppercase mb-4">
                      {isDragging ? "Drop to add" : "Drag & drop · or click + to upload"}
                    </p>
                  )}

                  {/* Grid: 4 cols on mobile, 7 on sm+ */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
                    {/* Filled slots */}
                    {images.map((img) => (
                      <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={img.preview} alt="Product preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-6 h-6 rounded-full bg-[#0D0D0D]/80 flex items-center justify-center text-[#D8C3AD] hover:text-white"
                            aria-label="Remove image"
                          >
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
                      <button
                        key={`slot-${i}`}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-square rounded-xl border border-[#534434]/20 hover:border-[#F59E0B]/30 hover:bg-[#F59E0B]/[0.04] transition-all duration-300 flex items-center justify-center group ${
                          i !== 0 ? "opacity-40" : ""
                        }`}
                        aria-label="Add image"
                      >
                        <svg className="w-4 h-4 text-[#D8C3AD]/20 group-hover:text-[#F59E0B]/60 transition-colors duration-300"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Error ───────────────────────────────────────────── */}
              {submitError && (
                <p className="text-[#ffb4ab] text-sm font-light text-center">{submitError}</p>
              )}

              {/* ── Submit ──────────────────────────────────────────── */}
              <div className="pt-2 pb-12 lg:pb-0 lg:mt-auto">
                <button
                  id="publish-product-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full overflow-hidden relative group bg-[#F59E0B] text-[#472A00] py-5 rounded-xl font-bold text-base tracking-[0.12em] uppercase hover:shadow-[0_0_50px_-8px_rgba(245,158,11,0.55)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Publishing..." : "Publish Product"}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-white/[0.15] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  )}
                </button>

                <p className="text-center text-[#D8C3AD]/20 text-[10px] tracking-widest uppercase mt-4">
                  Review before publishing
                </p>
              </div>

            </div>
            {/* end right panel */}

          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProduct;