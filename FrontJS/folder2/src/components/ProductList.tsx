import type { Product } from "../helper/types";

type Props = {
  products: Product[];
  onAddToCart: (product: Product, event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ProductList: React.FC<Props> = ({ products, onAddToCart }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
        Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <div className="h-52 w-full bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2">
                <img
                  src={product.picture}
                  alt={product.name}
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold text-xl mb-4">
                ${product.price}
              </p>
            </div>
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-sm"
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};