import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import "./Styles.css";

export default function CompletedTaskCard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const categories = [
    "technical",
    "complaints",
    "inquiries",
    "booking",
    "refund",
    "other",
  ];

  const url = `${import.meta.env.VITE_API_URL}/service/ticket`;

  const fetchTickets = async (selectedCategory = category) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/get_all_tickets`, {
        params: {
          filter: "finished",
          category: selectedCategory === "all" ? undefined : selectedCategory,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [category]);

  const handleCategoryChange = async (selectedCategory) => {
    await fetchTickets(selectedCategory);
    setCategory(selectedCategory);
  };

  const handleSearch = useCallback(debounce(setInputSearch, 300), []);

  const processedTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];
    let result = tickets.filter((ticket) =>
      ticket.ticketTitle?.toLowerCase().includes(inputSearch.toLowerCase())
    );
    if (sort) {
      result = [...result];
      switch (sort) {
        case "latest reply":
          return result.sort(
            (a, b) => new Date(b.ticketDone) - new Date(a.ticketDone)
          );
        case "oldest reply":
          return result.sort(
            (a, b) => new Date(a.ticketDone) - new Date(b.ticketDone)
          );
        case "latest":
          return result.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        case "oldest":
          return result.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        default:
          return result;
      }
    }
    return result;
  }, [tickets, inputSearch, sort]);

  const handleViewTicket = async (ticketId) => {
    try {
      const response = await axios.get(`${url}/get_ticket_staff/${ticketId}`);
      setSelectedTicket(response.data.ticketData);
      setViewModalOpen(true);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setViewModalOpen(false);
  };

  return (
    <div className="page p-4">
      <div className="card mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search tickets..."
            className="input input-bordered flex-1"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sort || ""}
            onChange={(e) => setSort(e.target.value || null)}
            className="select select-bordered"
          >
            <option value="">Default Sort</option>
            <option value="latest reply">Latest Reply</option>
            <option value="oldest reply">Oldest Reply</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : processedTickets.length === 0 ? (
          <div className="text-center py-4 text-gray-600">No tickets found</div>
        ) : (
          <ul className="ticket-list">
            {processedTickets.map((ticket) => (
              <li
                key={ticket._id}
                className="ticket-card cursor-pointer hover:shadow-lg"
                onClick={() => handleViewTicket(ticket._id)}
                tabIndex={0}
                role="button"
              >
                <h3 className="ticket-title">{ticket.ticketTitle}</h3>
                <p>
                  <strong>Reply:</strong>{" "}
                  {new Date(ticket.ticketDone).toLocaleDateString()}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(ticket.ticketDeadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {viewModalOpen && selectedTicket && (
        <dialog open className="modal">
          <form method="dialog" className="modal-box max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4 text-center">{selectedTicket.title}</h2>
            <p><strong>Category:</strong> {selectedTicket.category}</p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedTicket.createdAt).toLocaleString()}
            </p>
            <p className="py-2">{selectedTicket.description}</p>
            {selectedTicket.response && (
              <>
                <h4 className="font-bold text-lg mb-4 mt-4 text-center">Reply</h4>
                <p>
                  <strong>Reply At:</strong>{" "}
                  {selectedTicket.replyDate
                    ? new Date(selectedTicket.replyDate).toLocaleString()
                    : ""}
                </p>
                <p className="py-2">{selectedTicket.response}</p>
              </>
            )}
            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn bg-green-700 text-white hover:bg-green-800"
              >
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
}
