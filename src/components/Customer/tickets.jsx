import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from 'axios';
import { debounce } from 'lodash';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState(null);
    const [inputSearch, setInputSearch] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);

    const categories = ['technical', 'complaints', 'inquiries', 'booking', 'refund', 'other'];

    const processedTickets = useMemo(() => {
        if (!Array.isArray(tickets)) return [];
        let result = tickets.filter(ticket => 
            ticket.ticketTitle?.toLowerCase().includes(inputSearch.toLowerCase())
        );

        if (sort) {
            result = [...result];
            switch (sort) {
                case "latest": return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                case "oldest": return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                default: return result;
            }
        }
        return result;
    }, [tickets, inputSearch, sort]);

    const url = `${import.meta.env.VITE_API_URL}/service/ticket`

    const fetchTickets = async (selectedCategory = category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/get_all_tickets`, {
                params: {
                    filter: 'not-finished',
                    category: selectedCategory === 'all' ? undefined : selectedCategory
                }
            });
            console.log("API response:", response.data)
            setTickets(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        console.log("Fetching tickets for:", category)
        fetchTickets();
    }, [category]);

    const handleCategory = async (selectedCategory) => {
        try {
            await fetchTickets(selectedCategory);
            setCategory(selectedCategory);
        } catch (error) {
            console.error("Category filter error:", error);
        }
    };

    const handleSearch = useCallback(debounce(setInputSearch, 300), []);

    const handleView = async (ticketId) => {
        try {
            const response = await axios.get(`${url}/get-ticket-client/${ticketId}`);
            setSelectedTicket(response.data.ticketData);
            document.getElementById("view-modal").showModal();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    return (
        <div className="p-4">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search tickets..."
                    className="input input-bordered flex-1"
                />
                
                <select 
                    value={category}
                    onChange={(e) => handleCategory(e.target.value)}
                    className="select select-bordered"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>

                <select
                    value={sort || ''}
                    onChange={(e) => setSort(e.target.value || null)}
                    className="select select-bordered"
                >
                    <option value="">Default Sort</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : processedTickets.length === 0 ? (
                <div className="text-center py-4 text-gray-600">No tickets found</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedTickets.map(ticket => (
                                <tr key={ticket._id} onClick={() => handleView(ticket._id)} className="hover:bg-gray-200" role="button" tabIndex={0}>
                                    <td>{ticket.ticketTitle}</td>
                                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <dialog id="view-modal" className="modal">
                <form method="dialog" className="modal-box max-w-2xl max-h-[80vh] overflow-y-auto">
                    <h2 className="font-bold text-lg mb-4 text-center">{selectedTicket?.title}</h2>
                    <p><strong>Category:</strong> {selectedTicket?.category}</p>
                    <p><strong>Created At:</strong> {selectedTicket ? new Date(selectedTicket.createdAt).toLocaleString() : ''}</p>
                    <p className="py-2">{selectedTicket?.description}</p>
                    <div className="modal-action">
                    <button className="btn bg-green-700 text-white hover:bg-green-800">Close</button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default Tickets;