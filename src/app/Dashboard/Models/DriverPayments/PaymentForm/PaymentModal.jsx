"use client";
import { useState } from "react";

const PaymentModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        driverId: "",
        model: "",
        year: "",
        carType: "",
        amount: "",
        paymentMethod: "",
        cardDetails: {
            firstName: "",
            lastName: "",
            cardNumber: "",
            securityCode: "",
            expiryMonth: "",
            expiryYear: "",
        },
        bankDetails: {
            bank: "",
            accountNumber: "",
            accountTitle: "",
            email: "",
            contactInfo: "",
            purpose: "",
        },
        manualDetails: {
            recipient: "",
            contactNumber: "",
            transactionDate: "",
            proofOfPayment: "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [name]: value,
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Payment data submitted:", formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-12 w-[728px] rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">Payment</h2>
                    <img
                        src="/crossIcon.svg"
                        className="cursor-pointer"
                        alt="Close"
                        onClick={onClose}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
                        <div>
                            <label className="text-[10px]">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required placeholder="Name"
                            />
                        </div>

                        <div>
                            <label className="text-[10px]">Company</label>
                            <select
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Select company</option>
                                <option value="Company A">Company A</option>
                                <option value="Company B">Company B</option>
                                <option value="Company C">Company C</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px]">Driver ID</label>
                            <select
                                name="driverId"
                                value={formData.driverId}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Select driver</option>
                                <option value="Driver 1">Driver 1</option>
                                <option value="Driver 2">Driver 2</option>
                                <option value="Driver 3">Driver 3</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px]">Model</label>
                            <select
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Select model</option>
                                <option value="Model A">Model A</option>
                                <option value="Model B">Model B</option>
                                <option value="Model C">Model C</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px]">Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Select year</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px]">Car Type</label>
                            <select
                                name="carType"
                                value={formData.carType}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Select car type</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Jeep">Jeep</option>
                                <option value="SUV">SUV</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px]">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required placeholder="Amount"
                            />
                        </div>

                        <div>
                            <label className="text-[10px]">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="block w-full p-2 border border-[#42506666] shadow rounded"
                                required
                            >
                                <option value="">Payment method</option>
                                <option value="card">Card</option>
                                <option value="bankTransfer">Bank Transfer</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                    </div>

                    {formData.paymentMethod === "card" && (
                        <div className="">
                            <h2 className="font-bold">Card Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                                <div>
                                    <label className="text-[10px]">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.cardDetails.firstName}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="First Name"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.cardDetails.lastName}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Last Name"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardDetails.cardNumber}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Card Number"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Security Code</label>
                                    <input
                                        type="text"
                                        name="securityCode"
                                        value={formData.cardDetails.securityCode}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Security Code"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Expiry Month</label>
                                    <select
                                        name="expiryMonth"
                                        value={formData.cardDetails.expiryMonth}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required
                                    >
                                        <option value="">Select month</option>
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        {/* Add more months */}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px]">Expiry Year</label>
                                    <select
                                        name="expiryYear"
                                        value={formData.cardDetails.expiryYear}
                                        onChange={(e) => handleNestedChange(e, "cardDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required
                                    >
                                        <option value="">Select year</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.paymentMethod === "bankTransfer" && (

                        <div className="">
                            <h2 className="font-bold">Bank Transfer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                                <div>
                                    <label className="text-[10px]">Bank</label>
                                    <select
                                        name="bank"
                                        value={formData.bankDetails.bank}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required
                                    >
                                        <option value="">Select bank</option>
                                        <option value="Bank A">Bank A</option>
                                        <option value="Bank B">Bank B</option>
                                        <option value="Bank C">Bank C</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px]">Account Number</label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={formData.bankDetails.accountNumber}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Account Number"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Account Title</label>
                                    <input
                                        type="text"
                                        name="accountTitle"
                                        value={formData.bankDetails.accountTitle}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Account Title"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.bankDetails.email}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Email"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Contact Info</label>
                                    <input
                                        type="text"
                                        name="contactInfo"
                                        value={formData.bankDetails.contactInfo}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required placeholder="Contact Info"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px]">Purpose</label>
                                    <select
                                        name="purpose"
                                        value={formData.bankDetails.purpose}
                                        onChange={(e) => handleNestedChange(e, "bankDetails")}
                                        className="block w-full p-2 border border-[#42506666] shadow rounded"
                                        required
                                    >
                                        <option value="">Select purpose</option>
                                        <option value="Purpose A">Purpose A</option>
                                        <option value="Purpose B">Purpose B</option>
                                        <option value="Purpose C">Purpose C</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.paymentMethod === "manual" && (
                        <div className="">
                            <h2 className="font-bold">Manual Transfer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                                <div>
                                    <label className="text-[10px]">Recipient</label>
                                    <input
                                        type="text"
                                        name="recipient"
                                        value={formData.manualDetails.recipient}
                                        onChange={(e) => handleNestedChange(e, "manualDetails")}
                                        className="block w-full p-2 border rounded"
                                        required placeholder="Recipient"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px]">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.manualDetails.contactNumber}
                                        onChange={(e) => handleNestedChange(e, "manualDetails")}
                                        className="block w-full p-2 border rounded"
                                        required placeholder="Contact Number"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px]">Transaction Date</label>
                                    <input
                                        type="date"
                                        name="transactionDate"
                                        value={formData.manualDetails.transactionDate}
                                        onChange={(e) => handleNestedChange(e, "manualDetails")}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                {/* <div>
                                    <label className="text-[10px]">Proof of Payment</label>
                                    <input
                                        type="file"
                                        name="proofOfPayment"
                                        onChange={(e) => handleNestedChange(e, "manualDetails")}
                                        className="block w-full p-2 border rounded"
                                        required
                                    />
                                </div> */}

                                <div className="">
                                    <label
                                        htmlFor="useravatar"
                                        className="text-[10px]"
                                    >
                                        Upload Image:
                                    </label>
                                    <input
                                        type="file"
                                        id="useravatar"
                                        name="useravatar"
                                        accept="image/*"
                                        // onChange={handleFileChange}
                                        className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-[10px]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;