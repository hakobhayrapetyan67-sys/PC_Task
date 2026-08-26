import type { BasketItem } from "../helper/types";

type Props = {
  items: BasketItem[];
  onClear: () => void;
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
};

export const Basket: React.FC<Props> = ({
  items,
  onClear,
  onRemove,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Shopping Basket</h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm py-6 text-center">Զամբյուղը դատարկ է</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-blue-600 text-white uppercase text-xs tracking-wider">
                <th className="py-3 px-4 font-semibold">product</th>
                <th className="py-3 px-4 font-semibold">price</th>
                <th className="py-3 px-4 font-semibold">qty</th>
                <th className="py-3 px-4 font-semibold">subtotal</th>
                <th className="py-3 px-4 font-semibold">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.price} USD</td>
                  <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">
                    {item.price * item.quantity} USD
                  </td>
                  <td className="py-3 px-4 flex items-center gap-1.5">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center text-xs shadow-sm transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="w-7 h-7 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold flex items-center justify-center text-xs shadow-sm transition-colors"
                      title="Increase"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="w-7 h-7 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center text-xs shadow-sm transition-colors"
                      title="Decrease"
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};