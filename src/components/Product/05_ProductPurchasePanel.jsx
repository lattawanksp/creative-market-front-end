import { Link } from "react-router-dom";

const getCategoryFromTag = (tag) => tag.replace("#", "").trim();

const ProductPurchasePanel = ({
  product,
  onAddToCart,
  onBuyNow,
  adding,
  toast,
}) => {
  const tags = product?.tags || ["#Handmade"];
  const price = product?.price || 300;

  return (
    <section className="w-full text-[#2f2b78]">
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const category = getCategoryFromTag(tag);

            return (
              <Link
                key={tag}
                to={`/market?category=${encodeURIComponent(category)}`}
                className="inline-flex min-w-28 items-center justify-center rounded-md border border-[#b7b2d7] px-3 py-2 text-[11px] font-medium tracking-[0.01em] text-[#5a5596] transition hover:bg-[#f5f3ff] sm:min-w-32 sm:px-4 sm:text-sm"
              >
                {tag}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-4xl font-semibold leading-none tracking-[-0.04em] text-[#2f2b78] sm:text-5xl md:text-[3.5rem]">
              {price}.-
            </p>
            <p className="text-4xl font-semibold leading-none tracking-[-0.04em] text-[#2f2b78] sm:text-5xl md:text-[3.5rem]">
              บาท
            </p>
          </div>

          <div className="relative flex w-full flex-col gap-3 sm:w-56 md:w-64">
            {toast && (
              <div
                className={`absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all ${
                  toast === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {toast === "success"
                  ? "✓ Added to cart!"
                  : "✗ Failed, try again"}
              </div>
            )}

            <button
              type="button"
              onClick={onAddToCart}
              disabled={adding}
              className="w-full rounded-lg bg-[#534AB7] px-6 py-3.5 text-lg font-semibold tracking-[0.01em] text-white transition hover:bg-[#2f295f] sm:py-4 sm:text-xl"
              aria-label="Add to cart"
            >
              ADD TO CART
            </button>

            <button
              type="button"
              onClick={onBuyNow}
              disabled={adding}
              className="w-full rounded-lg bg-[#393276] px-6 py-3.5 text-lg font-semibold tracking-[0.01em] text-white transition hover:bg-[#2f295f] sm:py-4 sm:text-xl"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPurchasePanel;
