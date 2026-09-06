import { useRef, useState } from "react";
import "./MedicineStore.css";
import { createWorker } from "tesseract.js";

const medicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        price: 25,
        icon: "💊",
    },
    {
        id: 2,
        name: "Cetirizine 10mg",
        category: "Allergy Relief",
        price: 35,
        icon: "💊",
    },
    {
        id: 3,
        name: "ORS Sachets",
        category: "Hydration",
        price: 20,
        icon: "💧",
    },
    {
        id: 4,
        name: "Vitamin C Tablets",
        category: "Vitamins",
        price: 80,
        icon: "🍊",
    },
    {
        id: 5,
        name: "Azithromycin 500mg",
        category: "Antibiotic",
        price: 65,
        icon: "💊",
    },
    {
        id: 6,
        name: "Ibuprofen 400mg",
        category: "Pain Relief",
        price: 45,
        icon: "💊",
    },
];

const pharmacies = [
    {
        name: "Apollo Pharmacy",
        distance: "1.2 km",
        delivery: "25–35 min",
        status: "Open",
        rating: "4.8",
    },
    {
        name: "MedPlus",
        distance: "2.1 km",
        delivery: "30–40 min",
        status: "Open",
        rating: "4.7",
    },
    {
        name: "Wellness Forever",
        distance: "2.8 km",
        delivery: "35–45 min",
        status: "Open",
        rating: "4.6",
    },
];

function MedicineStore({ onBack }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    const [prescription, setPrescription] = useState(null);
    const [prescriptionText, setPrescriptionText] = useState("");
    const [detectedMedicines, setDetectedMedicines] = useState([]);
    const [isReadingPrescription, setIsReadingPrescription] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [prescriptionError, setPrescriptionError] = useState("");

    const prescriptionInputRef = useRef(null);

    const categories = [
        "All",
        "Pain Relief",
        "Allergy Relief",
        "Hydration",
        "Antibiotic",
        "Vitamins",
    ];

    // ----------------------------------------
    // SEARCH + CATEGORY FILTER
    // ----------------------------------------

    const filteredMedicines = medicines.filter((medicine) => {
        const matchesSearch = medicine.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" || medicine.category === category;

        return matchesSearch && matchesCategory;
    });

    // ----------------------------------------
    // CART FUNCTIONS
    // ----------------------------------------

    const addToCart = (medicine) => {
        setCart((previous) => {
            const existing = previous.find(
                (item) => item.id === medicine.id
            );

            if (existing) {
                return previous.map((item) =>
                    item.id === medicine.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );
            }

            return [
                ...previous,
                {
                    ...medicine,
                    quantity: 1,
                },
            ];
        });
    };

    const increaseQuantity = (id) => {
        setCart((previous) =>
            previous.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart((previous) =>
            previous
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart((previous) =>
            previous.filter((item) => item.id !== id)
        );
    };

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // ----------------------------------------
    // FIND MEDICINES FROM OCR TEXT
    // ----------------------------------------

    const findMedicinesInText = (text) => {
        const normalizedText = text.toLowerCase();

        return medicines.filter((medicine) => {
            const medicineName = medicine.name.toLowerCase();

            const words = medicineName
                .replace(/[()]/g, "")
                .split(/\s+/)
                .filter(
                    (word) =>
                        word.length >= 4 &&
                        !/^\d+mg$/.test(word) &&
                        !/^\d+$/.test(word)
                );

            return words.some((word) =>
                normalizedText.includes(word)
            );
        });
    };

    // ----------------------------------------
    // READ PRESCRIPTION USING OCR
    // ----------------------------------------

    const readPrescription = async (file) => {
        if (!file) return;

        setIsReadingPrescription(true);
        setPrescriptionError("");
        setPrescriptionText("");
        setDetectedMedicines([]);
        setOcrProgress(0);

        try {
            if (!file.type.startsWith("image/")) {
                throw new Error(
                    "For automatic prescription reading, please upload a clear image of the prescription."
                );
            }

            const worker = await createWorker("eng");

            await worker.setParameters({
                preserve_interword_spaces: "1",
            });

            const result = await worker.recognize(
                file,
                {},
                {
                    text: true,
                    confidence: true,
                }
            );

            const extractedText =
                result?.data?.text?.trim() || "";

            setPrescriptionText(extractedText);

            const matches = findMedicinesInText(extractedText);

            setDetectedMedicines(matches);

            await worker.terminate();

            setOcrProgress(100);

            if (!extractedText) {
                setPrescriptionError(
                    "No readable text was detected. Please upload a clearer prescription image."
                );
            }
        } catch (error) {
            console.error(
                "Prescription OCR Error:",
                error
            );

            setPrescriptionError(
                error?.message ||
                "Unable to read the prescription. Please try a clearer image."
            );
        } finally {
            setIsReadingPrescription(false);
        }
    };

    // ----------------------------------------
    // PRESCRIPTION UPLOAD
    // ----------------------------------------

    const handlePrescription = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            setPrescriptionError(
                "File is too large. Please upload an image below 10MB."
            );
            return;
        }

        setPrescription(file.name);
        setPrescriptionError("");
        setPrescriptionText("");
        setDetectedMedicines([]);

        await readPrescription(file);
    };

    // ----------------------------------------
    // DETECTED MEDICINE ACTIONS
    // ----------------------------------------

    const addDetectedMedicine = (medicine) => {
        addToCart(medicine);
    };

    const addAllDetectedMedicines = () => {
        detectedMedicines.forEach((medicine) => {
            addToCart(medicine);
        });

        if (detectedMedicines.length > 0) {
            alert(
                `✅ ${detectedMedicines.length} detected medicine(s) added to cart.`
            );
        }
    };

    // ----------------------------------------
    // PLACE ORDER
    // ----------------------------------------

    const placeOrder = () => {
        if (cart.length === 0) {
            alert("🛒 Your cart is empty.");
            return;
        }

        alert(
            `✅ Order request created successfully!\n\nItems: ${totalItems}\nTotal Amount: ₹${totalPrice}\n\nA pharmacy team can review the request before fulfilment.`
        );

        setCart([]);
        setShowCart(false);
    };

    // ----------------------------------------
    // UI
    // ----------------------------------------

    return (
        <div className="medicine-page">

            {/* ================= HEADER ================= */}

            <header className="medicine-header">
                <div>
                    <button
                        className="medicine-back"
                        onClick={onBack}
                    >
                        ← Dashboard
                    </button>

                    <div className="medicine-title-row">
                        <div className="medicine-title-icon">
                            💊
                        </div>

                        <div>
                            <span className="medicine-label">
                                RESQ HEALTHCARE
                            </span>

                            <h1>Medicine Store</h1>

                            <p>
                                Medicines, pharmacies and healthcare
                                essentials delivered to you.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="cart-button"
                    onClick={() =>
                        setShowCart(!showCart)
                    }
                >
                    🛒 <span>Cart</span>

                    {totalItems > 0 && (
                        <b>{totalItems}</b>
                    )}
                </button>
            </header>

            {/* ================= SEARCH ================= */}

            <section className="medicine-search-section">

                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search medicines, health products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <div className="category-list">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "category active"
                                    : "category"
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            {/* ================= OPTIONS ================= */}

            <section className="medicine-options">

                <div className="option-card">
                    <div className="option-icon blue">
                        💊
                    </div>

                    <div>
                        <h3>Buy Medicines</h3>
                        <p>
                            Search and order medicines
                        </p>
                    </div>

                    <span>→</span>
                </div>

                <div
                    className="option-card"
                    onClick={() =>
                        prescriptionInputRef.current?.click()
                    }
                    style={{ cursor: "pointer" }}
                >
                    <div className="option-icon red">
                        📄
                    </div>

                    <div>
                        <h3>Upload Prescription</h3>
                        <p>
                            Upload and read your prescription
                        </p>
                    </div>

                    <span>→</span>
                </div>

                <div
                    className="option-card"
                    onClick={() =>
                        setShowCart(true)
                    }
                    style={{ cursor: "pointer" }}
                >
                    <div className="option-icon green">
                        🚚
                    </div>

                    <div>
                        <h3>Home Delivery</h3>
                        <p>
                            Get medicines delivered safely
                        </p>
                    </div>

                    <span>→</span>
                </div>

            </section>

            {/* ================= MEDICINES ================= */}

            <section className="store-section">

                <div className="section-heading">
                    <div>
                        <span className="section-label">
                            PHARMACY STORE
                        </span>

                        <h2>Popular Medicines</h2>

                        <p>
                            Available medicines near you
                        </p>
                    </div>
                </div>

                <div className="medicine-grid">

                    {filteredMedicines.map(
                        (medicine) => (
                            <div
                                className="medicine-card"
                                key={medicine.id}
                            >
                                <div className="medicine-card-top">

                                    <div className="medicine-product-icon">
                                        {medicine.icon}
                                    </div>

                                    <span className="stock-badge">
                                        In Stock
                                    </span>
                                </div>

                                <span className="medicine-category">
                                    {medicine.category}
                                </span>

                                <h3>
                                    {medicine.name}
                                </h3>

                                <div className="medicine-bottom">

                                    <strong>
                                        ₹{medicine.price}
                                    </strong>

                                    <button
                                        onClick={() =>
                                            addToCart(
                                                medicine
                                            )
                                        }
                                    >
                                        + Add
                                    </button>

                                </div>
                            </div>
                        )
                    )}

                </div>

                {filteredMedicines.length === 0 && (
                    <div className="no-results">
                        🔍

                        <h3>
                            No medicines found
                        </h3>

                        <p>
                            Try another medicine name
                            or category.
                        </p>
                    </div>
                )}

            </section>

            {/* ================= PRESCRIPTION ================= */}

            <section className="prescription-section">

                <div className="prescription-icon">
                    📄
                </div>

                <div className="prescription-content">

                    <span>
                        PRESCRIPTION MEDICINES
                    </span>

                    <h2>
                        Have a prescription?
                    </h2>

                    <p>
                        Upload your prescription and RESQ
                        will read the text and identify
                        matching medicines from the store.
                    </p>

                    {prescription && (
                        <div className="uploaded-file">
                            ✓ {prescription}
                        </div>
                    )}

                    {/* OCR STATUS */}

                    {isReadingPrescription && (
                        <div
                            className="uploaded-file"
                            style={{
                                marginTop: "10px",
                            }}
                        >
                            🔄 Reading prescription...

                            {ocrProgress > 0 &&
                                ` ${ocrProgress}%`}
                        </div>
                    )}

                    {/* OCR ERROR */}

                    {prescriptionError && (
                        <div
                            className="uploaded-file"
                            style={{
                                marginTop: "10px",
                                color: "#b42318",
                            }}
                        >
                            ⚠️ {prescriptionError}
                        </div>
                    )}

                    {/* ================= DETECTED MEDICINES ================= */}

                    {detectedMedicines.length > 0 && (
                        <div
                            className="detected-medicines-box"
                            style={{
                                marginTop: "18px",
                                padding: "16px",
                                borderRadius: "14px",
                                background:
                                    "rgba(255,255,255,0.75)",
                                border:
                                    "1px solid rgba(0,0,0,0.08)",
                            }}
                        >

                            <div className="detected-medicines-title">

                                <span>💊</span>

                                <div>
                                    <strong>
                                        Medicines Found
                                        in Prescription
                                    </strong>

                                    <p>
                                        Matching medicines
                                        available in RESQ
                                        Medicine Store
                                    </p>
                                </div>

                            </div>

                            <div
                                className="detected-medicine-list"
                                style={{
                                    marginTop: "12px",
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: "8px",
                                }}
                            >

                                {detectedMedicines.map(
                                    (medicine) => (
                                        <div
                                            className="detected-medicine-row"
                                            key={medicine.id}
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: "12px",
                                            }}
                                        >

                                            <div
                                                className="detected-medicine-name"
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <span>
                                                    {
                                                        medicine.icon
                                                    }
                                                </span>

                                                <div>
                                                    <strong>
                                                        {
                                                            medicine.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            medicine.category
                                                        }{" "}
                                                        • ₹
                                                        {
                                                            medicine.price
                                                        }
                                                    </small>
                                                </div>
                                            </div>

                                            <button
                                                className="detected-add-button"
                                                onClick={() =>
                                                    addDetectedMedicine(
                                                        medicine
                                                    )
                                                }
                                                style={{
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                + Add
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>

                            {/* ADD ALL */}

                            {detectedMedicines.length >
                                1 && (
                                    <button
                                        className="add-all-button"
                                        onClick={
                                            addAllDetectedMedicines
                                        }
                                        style={{
                                            marginTop:
                                                "14px",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        🛒 Add All to Cart
                                    </button>
                                )}

                        </div>
                    )}

                    {/* ================= OCR TEXT ================= */}

                    {prescriptionText && (
                        <details
                            className="extracted-text"
                            style={{
                                marginTop: "14px",
                            }}
                        >
                            <summary
                                style={{
                                    cursor:
                                        "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                View extracted
                                prescription text
                            </summary>

                            <div
                                className="extracted-text-content"
                                style={{
                                    marginTop: "10px",
                                    padding: "12px",
                                    borderRadius:
                                        "10px",
                                    background:
                                        "rgba(0,0,0,0.04)",
                                    whiteSpace:
                                        "pre-wrap",
                                    fontSize: "13px",
                                    lineHeight: 1.6,
                                }}
                            >
                                {prescriptionText}
                            </div>
                        </details>
                    )}

                </div>

                {/* UPLOAD */}

                <label className="upload-button">

                    📤 Upload Prescription

                    <input
                        ref={prescriptionInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handlePrescription}
                    />

                </label>

            </section>

            {/* ================= PHARMACIES ================= */}

            <section className="store-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            NEARBY PHARMACIES
                        </span>

                        <h2>
                            Pharmacies Near You
                        </h2>

                        <p>
                            Available for medicine
                            delivery and pickup
                        </p>

                    </div>

                </div>

                <div className="pharmacy-grid">

                    {pharmacies.map(
                        (pharmacy) => (
                            <div
                                className="pharmacy-card"
                                key={pharmacy.name}
                            >

                                <div className="pharmacy-icon">
                                    🏪
                                </div>

                                <div className="pharmacy-info">

                                    <div className="pharmacy-name-row">

                                        <h3>
                                            {
                                                pharmacy.name
                                            }
                                        </h3>

                                        <span>
                                            ⭐{" "}
                                            {
                                                pharmacy.rating
                                            }
                                        </span>

                                    </div>

                                    <div className="pharmacy-details">

                                        <span>
                                            📍{" "}
                                            {
                                                pharmacy.distance
                                            }{" "}
                                            away
                                        </span>

                                        <span className="open-status">
                                            ●{" "}
                                            {
                                                pharmacy.status
                                            }
                                        </span>

                                        <span>
                                            🚚 Delivery:{" "}
                                            {
                                                pharmacy.delivery
                                            }
                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="pharmacy-button"
                                    onClick={() => {
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                pharmacy.name
                                            )}`,
                                            "_blank"
                                        );
                                    }}
                                >
                                    View
                                </button>

                            </div>
                        )
                    )}

                </div>

            </section>

            {/* ================= CART ================= */}

            {showCart && (
                <div className="cart-overlay">

                    <div className="cart-panel">

                        <div className="cart-header">

                            <div>

                                <span>
                                    RESQ STORE
                                </span>

                                <h2>
                                    Your Cart
                                </h2>

                            </div>

                            <button
                                onClick={() =>
                                    setShowCart(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {/* EMPTY CART */}

                        {cart.length === 0 ? (
                            <div className="empty-cart">

                                <div>🛒</div>

                                <h3>
                                    Your cart is empty
                                </h3>

                                <p>
                                    Add medicines to
                                    continue.
                                </p>

                            </div>
                        ) : (
                            <>
                                {/* CART ITEMS */}

                                <div className="cart-items">

                                    {cart.map(
                                        (item) => (
                                            <div
                                                className="cart-item"
                                                key={item.id}
                                            >

                                                <div className="cart-item-icon">
                                                    {
                                                        item.icon
                                                    }
                                                </div>

                                                <div className="cart-item-info">

                                                    <h4>
                                                        {
                                                            item.name
                                                        }
                                                    </h4>

                                                    <span>
                                                        ₹
                                                        {
                                                            item.price
                                                        }{" "}
                                                        each
                                                    </span>

                                                    <div className="quantity">

                                                        <button
                                                            onClick={() =>
                                                                decreaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </button>

                                                        <b>
                                                            {
                                                                item.quantity
                                                            }
                                                        </b>

                                                        <button
                                                            onClick={() =>
                                                                increaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                    <small>
                                                        Subtotal:
                                                        ₹
                                                        {
                                                            item.price *
                                                            item.quantity
                                                        }
                                                    </small>

                                                </div>

                                                <button
                                                    className="remove-item"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                                {/* CART SUMMARY */}

                                <div className="cart-summary">

                                    <div>

                                        <span>
                                            Total Items
                                        </span>

                                        <strong>
                                            {
                                                totalItems
                                            }
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                totalPrice
                                            }
                                        </strong>

                                    </div>

                                    <button
                                        className="order-button"
                                        onClick={
                                            placeOrder
                                        }
                                    >
                                        🚚 Place Order
                                    </button>

                                </div>

                            </>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

/* =====================================================
   VERY IMPORTANT
   This fixes your white blank page error:
   "does not provide an export named default"
   ===================================================== */

export default MedicineStore;