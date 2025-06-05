import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ticketService from './ticketService'

const initialState = {
    tickets: [],
    ticket: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

export const fetchTickets = createAsyncThunk(
    "tickets/fetchAll",
    async ({filter, category}, thunkAPI) => {
        try {
            return await ticketService.getAllTickets({filter, category});
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const ticketSlice = createSlice({
    name: "tickets",
    initialState,
    reducers: {
        reset: (state) => {
            state.tickets = [];
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
            state.ticket = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const {reset} = ticketSlice.actions;
export default ticketSlice.reducer;
