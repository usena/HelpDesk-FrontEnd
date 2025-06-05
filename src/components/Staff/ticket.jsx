import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from 'axios';
import { debounce } from 'lodash';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState(null);
    const [inputSearch, setInputSearch] = useState("");

    const categories = ['technical', 'complaints', 'inquiries', 'booking', 'refund', 'other'];

    const processedTickets = useMemo(() => {
        if (!Array.isArray(tickets)) return [];
        let result = tickets.filter(ticket => 
            ticket.ticketTitle?.toLowerCase().includes(inputSearch.toLowerCase())
        );

        if (sort) {
            result = [...result];
            switch (sort) {
                case "most urgent": return result.sort((a, b) => new Date(a.ticketDeadline) - new Date(b.ticketDeadline));
                case "least urgent": return result.sort((a, b) => new Date(b.ticketDeadline) - new Date(a.ticketDeadline));
                case "latest": return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                case "oldest": return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                default: return result;
            }
        }
        return result;
    }, [tickets, inputSearch, sort]);

    const fetchTickets = async (selectedCategory = category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/service/ticket/get_all_tickets`, {
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
                    <option value="most urgent">Most Urgent</option>
                    <option value="least urgent">Least Urgent</option>
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
                                <th>Status</th>
                                <th>Deadline</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedTickets.map(ticket => (
                                <tr key={ticket._id}>
                                    <td>{ticket.ticketTitle}</td>
                                    <td>{ticket.ticketStatus}</td>
                                    <td>{new Date(ticket.ticketDeadline).toLocaleDateString()}</td>
                                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Tickets;