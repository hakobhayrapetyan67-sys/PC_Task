import { Basket } from "./components/Basket";
import { ProductList } from "./components/ProductList";
import type { BasketItem, Product } from "./helper/types";
import { useState } from "react";

export default function App() {
  const [products] = useState<Product[]>([
    { id: 101, name: "Puma Rs-X1", price: 80, picture: "https://usmall.ru/image/1191/31/81/666faa512601c57082e8db8142c46fcd.jpeg" },
    { id: 102, name: "Puma Rs-X3", price: 90, picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK-_bUjSWesnwexlNhnEssMxVP7ukL2RCoOtf4ayTM7w&s=10" },
    { id: 103, name: "Puma Rs-X2", price: 100, picture: "https://i.ebayimg.com/images/g/U-0AAOSwvilm3eYl/s-l1200.png" },
    { id: 104, name: "Puma Rs-X4", price: 110, picture: "https://www.sneakerjagers.com/_next/image?url=https%3A%2F%2Fstatic.clickwire.io%2F14296%2Frs-xheader.png&w=3840&q=100" }
  ]);

  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  // Ավելացնել զամբյուղ + թռչող նկարի անիմացիա
  const handleAddToCart = (product: Product, event: React.MouseEvent<HTMLButtonElement>) => {
    setBasket((prevBasket) => {
      const existing = prevBasket.find((item) => item.id === product.id);
      if (existing) {
        return prevBasket.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevBasket, { ...product, quantity: 1 }];
    });

    const button = event.currentTarget;
    const card = button.closest(".bg-white");
    const img = card?.querySelector("img");
    const basketIcon = document.getElementById("basket-icon");

    if (img && basketIcon) {
      const imgRect = img.getBoundingClientRect();
      const basketRect = basketIcon.getBoundingClientRect();

      const flyingImg = document.createElement("img");
      flyingImg.src = product.picture;
      flyingImg.style.position = "fixed";
      flyingImg.style.left = `${imgRect.left}px`;
      flyingImg.style.top = `${imgRect.top}px`;
      flyingImg.style.width = `${imgRect.width}px`;
      flyingImg.style.height = `${imgRect.height}px`;
      flyingImg.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      flyingImg.style.zIndex = "9999";
      flyingImg.style.borderRadius = "12px";
      flyingImg.style.pointerEvents = "none";

      document.body.appendChild(flyingImg);

      setTimeout(() => {
        flyingImg.style.left = `${basketRect.left + basketRect.width / 2}px`;
        flyingImg.style.top = `${basketRect.top + basketRect.height / 2}px`;
        flyingImg.style.width = "20px";
        flyingImg.style.height = "20px";
        flyingImg.style.opacity = "0.3";
      }, 10);

      setTimeout(() => {
        flyingImg.remove();
      }, 800);
    }
  };

  // Զամբյուղի կառավարման ֆունկցիաներ
  const handleClearBasket = () => setBasket([]);
  const handleRemove = (id: number) => setBasket((prev) => prev.filter((item) => item.id !== id));
  const handleIncrease = (id: number) => setBasket((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const handleDecrease = (id: number) => setBasket((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));

  const totalItemsCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-8 bg-white text-gray-900 min-h-screen relative">
      {/* Վերնագիր և Զամբյուղի կոճակ */}
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-4xl font-bold tracking-tight">Online Shop</h1>
        
        <div 
          id="basket-icon" 
          onClick={() => setIsBasketOpen(!isBasketOpen)}
          className="relative bg-gray-100 hover:bg-gray-200 p-3 rounded-full cursor-pointer transition-colors shadow-sm flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {totalItemsCount}
            </span>
          )}
        </div>

        {/* Բացվող զամբյուղի պատուհան (Dropdown) */}
        {isBasketOpen && (
          <div className="absolute right-0 top-16 w-[480px] bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 z-50">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Cart Management</span>
              <button 
                onClick={() => setIsBasketOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold px-2 py-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <Basket 
              items={basket} 
              onClear={handleClearBasket} 
              onRemove={handleRemove}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>
        )}
      </div>

      {/* Ապրանքների ցանկ */}
      <div>
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}