import { useEffect, useState } from "react";
import { ConfirmationModalProps } from "../types/types";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText }: ConfirmationModalProps) => {
    const [buttonText, setButtonText] = useState(confirmText || "Confirmar");

    useEffect(() => {
        if (confirmText) {
            setButtonText(confirmText);
        }
    }, [confirmText]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl border border-gray-300 w-96">
                <h2 className="text-xl font-bold text-gray-900 text-center">{title}</h2>
                <p className="mt-2 text-gray-700 text-center">{message}</p>

                <div className="flex justify-center space-x-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

