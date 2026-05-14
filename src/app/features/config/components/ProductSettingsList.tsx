interface ProductField {
  k: string;
  v: string;
}

interface Product {
  name: string;
  fields: ProductField[];
}

interface ProductSettingsListProps {
  products: Product[];
}

export function ProductSettingsList({ products }: ProductSettingsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Product Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.name} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group">
            <p className="text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</p>
            <div className="space-y-1">
              {product.fields.map((f) => (
                <div key={f.k} className="flex justify-between text-[11px] py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{f.k}</span>
                  <span className="font-medium text-gray-800">{f.v.replace("$", "₹")}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-center py-1.5 text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              Edit Settings
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
