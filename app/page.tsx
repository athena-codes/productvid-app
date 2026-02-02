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
  Crown,
  Info,
  Loader2,
} from "lucide-react";
import { ProductShowcase } from "@/remotion/compositions/ProductShowcase";
import Navigation from "./components/Navigation";
import HistoryTab from "./components/HistoryTab";
import SettingsTab from "./components/SettingsTab";
import AccountTab from "./components/AccountTab";

// Default sample images for demo
const defaultImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
];

type ImageEntry =
  | { preview: string; type: "url"; url: string }
  | { preview: string; type: "file"; file: File };

const urlEntries: ImageEntry[] = defaultImages.map((url) => ({
  preview: url,
  type: "url" as const,
  url,
}));

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "history" | "settings" | "account">("generate");
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>(urlEntries);
  const [productName, setProductName] = useState("Premium Watch");
  const [productPrice, setProductPrice] = useState("$299.99");
  const [backgroundColor, setBackgroundColor] = useState("#1a1a2e");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isGenerating, setIsGenerating] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newEntries: ImageEntry[] = acceptedFiles.map((file) => ({
      preview: URL.createObjectURL(file),
      type: "file" as const,
      file,
    }));
    setImageEntries((prev) => [...prev, ...newEntries].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 5,
    disabled: imageEntries.length >= 5,
  });

  const removeImage = (index: number) => {
    setImageEntries((prev) => {
      const entry = prev[index];
      if (entry.type === "file" && entry.preview.startsWith("blob:")) {
        URL.revokeObjectURL(entry.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const productImages = useMemo(
    () => imageEntries.map((e) => e.preview),
    [imageEntries]
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
      const formData = new FormData();
      const imageUrls: string[] = [];
      let fileIndex = 0;

      for (const entry of imageEntries) {
        if (entry.type === "file") {
          formData.append(`file_${fileIndex}`, entry.file);
          imageUrls.push(`upload:${fileIndex}`);
          fileIndex++;
        } else {
          imageUrls.push(entry.url);
        }
      }

      formData.append(
        "props",
        JSON.stringify({
          productImages: imageUrls,
          productName,
          productPrice,
          backgroundColor,
          textColor,
        })
      );

      const response = await fetch("/api/render", {
        method: "POST",
        body: formData,
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
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "generate" ? (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create Product Videos
              </h1>
              <p className="text-slate-600">
                Upload your product images and customize your video in seconds
              </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                {/* Upload Zone */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-slate-600" />
                        Product Images
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Upload up to 5 images (JPG, PNG, WEBP)
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      {imageEntries.length}/5
                    </span>
                  </div>

                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                      transition-all duration-200
                      ${
                        isDragActive
                          ? "border-blue-400 bg-blue-50 scale-[1.02]"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }
                      ${imageEntries.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-slate-900 font-semibold mb-1">
                      {isDragActive ? "Drop images here" : "Drop images or click to browse"}
                    </p>
                    <p className="text-slate-500 text-sm">
                      Supports JPG, PNG, and WEBP formats
                    </p>
                  </div>

                  {/* Image Grid */}
                  {imageEntries.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      {imageEntries.map((entry, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                        >
                          <img
                            src={entry.preview}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                     flex items-center justify-center transition-opacity"
                          >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Product Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Premium Wireless Headphones"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="$299.99"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Customization */}
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Video Styling
                    </h2>
                    <div className="group relative">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Pro Feature
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-14 h-12 rounded-lg cursor-pointer border-2 border-slate-200"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 input-field font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-14 h-12 rounded-lg cursor-pointer border-2 border-slate-200"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 input-field font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || imageEntries.length === 0}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Video
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || imageEntries.length === 0}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-900 font-medium mb-1">
                      Your video will be ready in 15-30 seconds
                    </p>
                    <p className="text-blue-700">
                      Videos are generated at 1080x1920 resolution, perfect for Instagram, TikTok, and other social platforms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Live Preview
                  </h2>

                  <div
                    className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    style={{ aspectRatio: "9/16" }}
                  >
                    {imageEntries.length > 0 ? (
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
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="font-medium">No images yet</p>
                          <p className="text-sm mt-1">Upload images to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Specs */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-500 mb-1">Resolution</div>
                      <div className="text-slate-900 font-semibold">1080x1920</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-500 mb-1">Duration</div>
                      <div className="text-slate-900 font-semibold">10 sec</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-500 mb-1">FPS</div>
                      <div className="text-slate-900 font-semibold">30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "history" ? (
          <HistoryTab />
        ) : activeTab === "settings" ? (
          <SettingsTab />
        ) : (
          <AccountTab />
        )}
      </main>
    </div>
  );
}
