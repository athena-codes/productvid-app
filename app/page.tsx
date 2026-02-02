"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Player } from "@remotion/player";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Download,
  Trash2,
  Type,
  DollarSign,
  Palette,
  Play,
} from "lucide-react";
import { ProductShowcase } from "@/remotion/compositions/ProductShowcase";

// Default sample images for demo
const defaultImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
];

export default function Home() {
  const [productImages, setProductImages] = useState<string[]>(defaultImages);
  const [productName, setProductName] = useState("Premium Watch");
  const [productPrice, setProductPrice] = useState("$299.99");
  const [backgroundColor, setBackgroundColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isGenerating, setIsGenerating] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.slice(0, 5 - productImages.length);
      const imageUrls = newImages.map((file) => URL.createObjectURL(file));
      setProductImages((prev) => [...prev, ...imageUrls].slice(0, 5));
    },
    [productImages.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 5,
    disabled: productImages.length >= 5,
  });

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const hasUploadedImages = productImages.some((url) =>
    url.startsWith("blob:")
  );
  const canRender = productImages.some(
    (url) => typeof url === "string" && url.startsWith("http")
  );

  const inputProps = useMemo(
    () => ({
      productImages,
      productName,
      productPrice,
      backgroundColor,
      textColor,
    }),
    [productImages, productName, productPrice, backgroundColor, textColor]
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productImages,
          productName,
          productPrice,
          backgroundColor,
          textColor,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Generation failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product-showcase.mp4";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Video generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <Play className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            ProductVid
          </h1>
        </div>
        <p className="text-white/70 text-lg">
          Create stunning product showcase videos in seconds
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Left Side - Controls */}
        <div className="space-y-6">
          {/* Upload Zone */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-white/80" />
              <h2 className="text-lg font-semibold text-white">
                Product Images
              </h2>
              <span className="text-white/50 text-sm ml-auto">
                {productImages.length}/5
              </span>
            </div>

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200 ease-out
                ${
                  isDragActive
                    ? "border-white bg-white/20 scale-[1.02]"
                    : "border-white/30 hover:border-white/50 hover:bg-white/5"
                }
                ${productImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-white/60 mx-auto mb-3" />
              <p className="text-white/80 font-medium">
                {isDragActive
                  ? "Drop images here..."
                  : "Drag & drop product images"}
              </p>
              <p className="text-white/50 text-sm mt-1">
                or click to browse (max 5 images)
              </p>
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-white/10"
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-white/80" />
              Product Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                           text-white placeholder-white/40 focus:border-white/40 focus:ring-2
                           focus:ring-white/20 transition-all"
                />
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Product Price
                </label>
                <input
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="$0.00"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                           text-white placeholder-white/40 focus:border-white/40 focus:ring-2
                           focus:ring-white/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-white/80" />
              Colors
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20
                             bg-transparent overflow-hidden"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2
                             text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">
                  Text Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/20
                             bg-transparent overflow-hidden"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2
                             text-white text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Render hint */}
          {hasUploadedImages && !canRender && (
            <div className="text-amber-200/90 text-sm bg-amber-500/20 rounded-xl px-4 py-2">
              Video generation uses image URLs. Use the default sample images or
              paste image links for rendering.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || productImages.length === 0 || !canRender}
              className="flex-1 bg-white text-purple-900 font-bold py-4 px-6 rounded-xl
                       flex items-center justify-center gap-2 hover:bg-white/90
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "Generating..." : "Generate Video"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || productImages.length === 0 || !canRender}
              className="bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-6 rounded-xl
                       flex items-center justify-center gap-2 hover:bg-white/20
                       border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>

        {/* Right Side - Video Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-white/80" />
              Live Preview
            </h2>

            <div
              className="rounded-xl overflow-hidden bg-black/20"
              style={{ aspectRatio: "9/16" }}
            >
              {productImages.length > 0 ? (
                <Player
                  component={ProductShowcase}
                  inputProps={inputProps}
                  durationInFrames={300}
                  fps={30}
                  compositionWidth={1080}
                  compositionHeight={1920}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  controls
                  autoPlay
                  loop
                  acknowledgeRemotionLicense
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload images to see preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-white/5 rounded-xl">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-white/50">Resolution</div>
                  <div className="text-white font-semibold">1080x1920</div>
                </div>
                <div>
                  <div className="text-white/50">Duration</div>
                  <div className="text-white font-semibold">10 seconds</div>
                </div>
                <div>
                  <div className="text-white/50">FPS</div>
                  <div className="text-white font-semibold">30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-white/40 text-sm">
        <p>ProductVid - AI-Powered Product Video Generator</p>
      </footer>
    </main>
  );
}
