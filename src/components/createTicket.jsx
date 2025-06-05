import React, { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateTicket = () => {

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("inquiries");
    const [desc, setDesc] = useState("");

    const categories = ['technical', 'complaints', 'inquiries', 'booking', 'refund', 'other'];

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        const url = `${import.meta.env.VITE_API_URL}/service/ticket/add_ticket`;
        console.log("Post to: ", `${import.meta.env.VITE_API_URL}/service/ticket/add_ticket`);

        try {
            const response = await axios.post(url, {
                ticketTitle: title,
                ticketCategory: category,
                ticketDesc: desc
            });

            toast.success("Ticket created successfully!");

            setTitle("")
            setCategory("")
            setDesc("")
        } catch (error) {
            if (error.response) {
                // Backend responded with an error
                const status = error.response.status;
                const msg = error.response.data.message;

                if (status === 400) {
                    toast.error(msg || "Please fill all required fields.");
                } else {
                    toast.error(msg || "An unexpected server error occurred.");
                }
            } else if (error.request) {
                // Request was made but no response
                toast.error("No response from server. Check your network.");
            } else {
                // Something else happened
                toast.error("An error occurred while creating the ticket.");
            }

            console.error("Create ticket error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-semibold text-green-800 mb-6 text-center">Create A Ticket</h1>
                <form className="flex flex-col gap-4" onSubmit={handleCreateTicket}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <textarea
                        rows={5}
                        placeholder="Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTicket;
