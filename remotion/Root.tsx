import { Composition } from "remotion";
import {
  ProductShowcase,
  ProductShowcaseProps,
} from "./compositions/ProductShowcase";

// Default sample images from Unsplash for testing
const defaultProps: ProductShowcaseProps = {
  productImages: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
  ],
  productName: "Premium Watch",
  productPrice: "$299.99",
  backgroundColor: "#1a1a2e",
  textColor: "#ffffff",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductShowcase"
        component={ProductShowcase}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
