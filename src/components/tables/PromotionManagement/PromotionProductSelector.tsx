import { useAllProducts } from '../../../hooks/useProducts';
import { Product } from '../../../services/productService';

interface PromotionProductSelectorProps {
  selectedProductId: number | null;
  onSelectionChange: (productId: number | null) => void;
}

export default function PromotionProductSelector({
  selectedProductId,
  onSelectionChange,
}: PromotionProductSelectorProps) {
  // Lấy danh sách products
  const { data: productsData, isLoading: isLoadingProducts } = useAllProducts();
  const products: Product[] = productsData?.data || [];

  // Handler để chọn product
  const handleProductSelect = (productId: number) => {
    onSelectionChange(productId);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Sản phẩm áp dụng khuyến mãi <span className="text-gray-500">(chọn 1 sản phẩm)</span>
      </label>
      
      {isLoadingProducts ? (
        <div className="text-center py-4 text-sm text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg">
          Đang tải danh sách sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg">
          Không có sản phẩm nào
        </div>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            {products.map((product) => {
              const productId = Number(product.productId || product.id);
              const isSelected = Number(selectedProductId) === productId;
              return (
                <label
                  key={productId}
                  className={`flex items-center px-3 py-2 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
                    isSelected 
                      ? 'bg-primary/10 dark:bg-primary/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => handleProductSelect(productId)}
                >
                  <input
                    type="radio"
                    name="promotion-product"
                    value={productId}
                    checked={isSelected}
                    className="w-4 h-4 text-primary border-gray-300 cursor-pointer"
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          
          {selectedProductId && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Đã chọn: {products.find(p => (p.productId || p.id) === selectedProductId)?.name}
            </p>
          )}
        </>
      )}
    </div>
  );
}

