import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import os from "os";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes for video rendering

interface RenderRequestBody {
  productImages: string[];
  productName: string;
  productPrice: string;
  backgroundColor: string;
  textColor: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RenderRequestBody = await request.json();

    const { productImages, productName, productPrice, backgroundColor, textColor } =
      body;

    if (!productImages?.length) {
      return NextResponse.json(
        { error: "At least one product image is required" },
        { status: 400 }
      );
    }

    // Filter to only HTTP/HTTPS URLs (blob URLs won't work server-side)
    const validImages = productImages.filter(
      (url) => typeof url === "string" && /^https?:\/\//i.test(url)
    );

    if (validImages.length === 0) {
      return NextResponse.json(
        {
          error:
            "Please use image URLs (e.g. from Unsplash). Uploaded images are shown in preview but cannot be rendered yet.",
        },
        { status: 400 }
      );
    }

    const props = {
      productImages: validImages,
      productName: productName || "Product",
      productPrice: productPrice || "",
      backgroundColor: backgroundColor || "#1a1a2e",
      textColor: textColor || "#ffffff",
    };

    // Create temp directory for this render
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "productvid-"));
    const propsPath = path.join(tempDir, "props.json");
    const outputPath = path.join(tempDir, "video.mp4");

    await fs.writeFile(propsPath, JSON.stringify(props));

    const projectRoot = process.cwd();

    await new Promise<void>((resolve, reject) => {
      const args = [
        "render",
        "ProductShowcase",
        outputPath,
        "--props",
        propsPath,
        "--codec",
        "h264",
        "--log",
        "error",
      ];

      const remotion = spawn("npx", ["remotion", ...args], {
        cwd: projectRoot,
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stderr = "";
      remotion.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      remotion.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Remotion failed: ${stderr || `Exit code ${code}`}`));
        }
      });

      remotion.on("error", reject);
    });

    const videoBuffer = await fs.readFile(outputPath);

    // Cleanup temp files
    await fs.rm(tempDir, { recursive: true, force: true });

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="product-showcase.mp4"',
        "Content-Length": videoBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Video generation failed. Ensure Remotion CLI and FFmpeg are available.",
      },
      { status: 500 }
    );
  }
}
