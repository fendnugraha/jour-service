import formatNumber from "@/libs/formatNumber";
import { PlusCircleIcon } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="group bg-white rounded-2xl px-4 py-4 shadow-md hover:bg-indigo-50">
            <h1 className="text-xs font-bold group-hover:scale-105 group-hover:translate-x-4 transition-transform duration-300 ease-out ">{product.name}</h1>
            <small className="text-xs text-gray-500">Stock: {product.end_stock}</small>
            <div className="flex justify-between items-center mt-2">
                <h4 className="bg-sky-500 text-white py-1 px-4 rounded-full text-sm font-bold">Rp. {formatNumber(product.price)}</h4>
                <button onClick={() => onAddToCart(product)} className="group-hover:scale-105 hover:text-blue-500 transition-transform duration-300 ease-out">
                    <PlusCircleIcon className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
