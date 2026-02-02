import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import os from "os";
import http from "http";
import serveHandler from "serve-handler";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // 2 minutes for video rendering

interface RenderProps {
  productImages: string[];
  productName: string;
  productPrice: string;
  backgroundColor: string;
  textColor: string;
}

async function runRemotionRender(
  tempDir: string,
  props: RenderProps
): Promise<Buffer> {
  const propsPath = path.join(tempDir, "props.json");
  const outputPath = path.join(tempDir, "video.mp4");
  const projectRoot = process.cwd();

  await fs.writeFile(propsPath, JSON.stringify(props));

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

  return fs.readFile(outputPath);
}

export async function POST(request: NextRequest) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "productvid-"));
  let httpServer: http.Server | null = null;

  try {
    const contentType = request.headers.get("content-type") || "";
    let productImages: string[];
    let productName: string;
    let productPrice: string;
    let backgroundColor: string;
    let textColor: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const propsJson = formData.get("props");
      if (typeof propsJson !== "string") {
        return NextResponse.json(
          { error: "Missing props in form data" },
          { status: 400 }
        );
      }
      const props: RenderProps = JSON.parse(propsJson);
      productImages = [...(props.productImages || [])];
      productName = props.productName || "Product";
      productPrice = props.productPrice || "";
      backgroundColor = props.backgroundColor || "#1a1a2e";
      textColor = props.textColor || "#ffffff";

      // Save uploaded files and replace placeholders with HTTP URLs
      const savedFiles: { index: number; fileName: string }[] = [];
      for (let i = 0; i < productImages.length; i++) {
        const entry = productImages[i];
        const uploadMatch =
          typeof entry === "string" && entry.match(/^upload:(\d+)$/);
        if (uploadMatch) {
          const fileIndex = parseInt(uploadMatch[1], 10);
          const file = formData.get(`file_${fileIndex}`);
          if (!(file instanceof File)) {
            return NextResponse.json(
              { error: `Missing uploaded file ${fileIndex}` },
              { status: 400 }
            );
          }
          const ext = path.extname(file.name) || ".jpg";
          const fileName = `image_${fileIndex}${ext}`;
          const filePath = path.join(tempDir, fileName);
          const buffer = Buffer.from(await file.arrayBuffer());
          await fs.writeFile(filePath, buffer);
          savedFiles.push({ index: i, fileName });
        }
      }

      // Serve uploaded files over HTTP (Remotion requires HTTP URLs)
      if (savedFiles.length > 0) {
        httpServer = http.createServer((req, res) =>
          serveHandler(req, res, {
            public: tempDir,
            headers: [
              {
                source: "**",
                headers: [
                  { key: "Access-Control-Allow-Origin", value: "*" },
                ],
              },
            ],
          })
        );

        await new Promise<void>((resolve) =>
          httpServer!.listen(0, "127.0.0.1", resolve)
        );
        const port = (httpServer!.address() as { port: number }).port;
        const baseUrl = `http://127.0.0.1:${port}`;

        for (const { index, fileName } of savedFiles) {
          productImages[index] = `${baseUrl}/${fileName}`;
        }
      }
    } else {
      const body = await request.json();
      const {
        productImages: images,
        productName: name,
        productPrice: price,
        backgroundColor: bg,
        textColor: txt,
      } = body;
      productImages = (images || []).filter(
        (url: unknown) =>
          typeof url === "string" && /^https?:\/\//i.test(url)
      );
      productName = name || "Product";
      productPrice = price || "";
      backgroundColor = bg || "#1a1a2e";
      textColor = txt || "#ffffff";
    }

    if (!productImages?.length) {
      return NextResponse.json(
        { error: "At least one product image is required" },
        { status: 400 }
      );
    }

    const props: RenderProps = {
      productImages,
      productName,
      productPrice,
      backgroundColor,
      textColor,
    };

    const videoBuffer = await runRemotionRender(tempDir, props);

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
  } finally {
    if (httpServer) {
      await new Promise<void>((resolve) => {
        httpServer!.close(() => resolve());
      });
    }
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
