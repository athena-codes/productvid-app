import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ProductShowcaseProps {
  productImages: string[];
  productName: string;
  productPrice: string;
  backgroundColor: string;
  textColor: string;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  productImages,
  productName,
  productPrice,
  backgroundColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Each image shows for 2 seconds (60 frames at 30fps)
  // With 0.5s transitions (15 frames)
  const imageDuration = fps * 2; // 60 frames
  const transitionDuration = fps * 0.5; // 15 frames

  // Calculate current image index
  const currentImageIndex = Math.min(
    Math.floor(frame / imageDuration),
    productImages.length - 1
  );

  // Calculate progress within current image segment
  const progressInSegment = frame % imageDuration;

  // Fade in/out calculations
  const fadeIn = interpolate(
    progressInSegment,
    [0, transitionDuration],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    progressInSegment,
    [imageDuration - transitionDuration, imageDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Zoom effect
  const scale = interpolate(
    progressInSegment,
    [0, imageDuration],
    [1, 1.15],
    { extrapolateRight: "clamp" }
  );

  // Text animations using spring
  const titleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const priceSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleTranslateY = interpolate(titleSpring, [0, 1], [50, 0]);
  const priceTranslateY = interpolate(priceSpring, [0, 1], [30, 0]);

  // End card animation
  const isEndCard = frame > durationInFrames - fps * 2;
  const endCardProgress = interpolate(
    frame,
    [durationInFrames - fps * 2, durationInFrames - fps * 1.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Product Images */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          width: "85%",
          height: "55%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {productImages.length > 0 && productImages[currentImageIndex] && (
          <Img
            src={productImages[currentImageIndex]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        )}
      </div>

      {/* Gradient overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)`,
        }}
      />

      {/* Product Info */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        {/* Product Name */}
        <h1
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 72,
            fontWeight: 800,
            color: textColor,
            margin: 0,
            marginBottom: 20,
            opacity: titleSpring,
            transform: `translateY(${titleTranslateY}px)`,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            letterSpacing: "-0.02em",
          }}
        >
          {productName}
        </h1>

        {/* Product Price */}
        <div
          style={{
            display: "inline-block",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: 16,
            padding: "16px 48px",
            opacity: priceSpring,
            transform: `translateY(${priceTranslateY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: textColor,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {productPrice}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {productImages.map((_, index) => (
          <div
            key={index}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor:
                index === currentImageIndex
                  ? textColor
                  : `${textColor}40`,
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* End card CTA */}
      {isEndCard && (
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: endCardProgress,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: textColor,
              color: backgroundColor,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              padding: "20px 60px",
              borderRadius: 50,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            Shop Now
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
