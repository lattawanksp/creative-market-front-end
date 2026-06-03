import ProductHeaderBar from "../components/Product/01_ProductHeaderBar";
import ProductGallery from "../components/Product/02_ProductGallery";
import ProductInfo from "../components/Product/03_ProductInfo";
import ArtistInfo from "../components/Product/04_ArtistInfo";
import ProductPurchasePanel from "../components/Product/05_ProductPurchasePanel";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Product = () => {
  const navigate = useNavigate();
  const { productSlug } = useParams();

  const { isLoggedIn, userRole } = useAuth();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  const serverBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";
  const apiBaseUrl = `${serverBaseUrl}/api`;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${apiBaseUrl}/products/${productSlug}`);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch product");
        }

        setProduct(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async ({ showToastMessage = true } = {}) => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนเลือกซื้อสินค้าค่ะ");
      return false;
    }

    if (userRole !== "user") {
      alert(
        "ขออภัยด้วยนะคะ บัญชีประเภทผู้ดูแลระบบ (Admin) ไม่สามารถเพิ่มสินค้าลงตะกร้าได้ค่ะ ✗",
      );
      return false;
    }

    setAdding(true);

    try {
      const response = await fetch(`${apiBaseUrl}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add product to cart");
      }

      refreshCart();

      if (showToastMessage) {
        showToast("success");
      }

      return true;
    } catch (error) {
      showToast("error");
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    const added = await handleAddToCart({ showToastMessage: false });

    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eeecfb]">
        <p className="text-lg font-semibold text-[#2f2b78]">
          Loading product...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eeecfb]">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eeecfb]">
        <p className="text-lg font-semibold text-[#2f2b78]">
          Product not found
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#eeecfb]">
      <ProductHeaderBar category={product.category} />

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-10 sm:px-6 md:gap-8 md:px-8 md:pb-12">
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[1.02fr_1fr] lg:items-start">
          <div className="w-full">
            <ProductGallery images={product.images} />
          </div>

          <div className="flex w-full flex-col gap-6 md:gap-8">
            <ProductInfo product={product} />
            <ArtistInfo paragraphs={product.fromArtist} />
            <ProductPurchasePanel
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              adding={adding}
              toast={toast}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Product;
