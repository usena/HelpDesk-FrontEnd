import axios from 'axios';

const API_URL = '/service/ticket';

const getAllTickets = async (filter, category) => {
    const response = await axios.post(API_URL + "/get_all_tickets", {
        params: {
            filter, 
            category: category === 'all' ? undefined : category
        }
    });
    return response.data;
};
    
const submitTicket = async (ticketData) => {
    const response = await axios.post(API_URL + "add_ticket", ticketData);
    return response.data;
}

const ticketService = {
    getAllTickets,
    submitTicket,
};

export default ticketService