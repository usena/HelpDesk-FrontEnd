import React, { useState } from "react";
import Tickets from "./ticket";
import Completed from "./completed";
import CreateTicket from "../createTicket";
import StaffFAQ from "./StaffFAQ";

import {
    LayoutDashboard,
    UserCircle,
    Settings,
    Menu,
    MessageSquare
} from "lucide-react";


const Sidebar = () => {
    const [activePage, setActivePage] = useState("dashboard");


    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main content area */}
            <div className="drawer-content flex flex-col items-start justify-normal justify-22">
                <label htmlFor="my-drawer" className="btn btn-success rounded-none drawer-button lg:hidden">
                    <Menu />
                </label>

                <div className="flex w-full h-full gap-8 pt-2 pb-4 px-6">
                    <div className="flex flex-col gap-3 w-full rounded-md p-4">
                        {activePage === "dashboard" && <Tickets />}
                        {activePage === "finished" && <Completed />}
                        {activePage === "createTicket" && <CreateTicket />}
                        {activePage === "faq" && <StaffFAQ/>}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-green-200 text-base-content min-h-full w-80 p-4 pt-26">
                <li>
                    <button
                    className={activePage === "dashboard" ? "active" : ""}
                    onClick={() => setActivePage("dashboard")}
                    >
                        Dashboard
                    </button>
                </li>
                <li>
                    <button
                    className={activePage === "finished" ? "active" : ""}
                    onClick={() => setActivePage("finished")}
                    >
                        Completed
                    </button>
                </li>
                <li>
                    <button
                    className={activePage === "createTicket" ? "active" : ""}
                    onClick={() => setActivePage("createTicket")}
                    >
                        Create Ticket
                    </button>
                </li>
                <li>
                    <button
                    className={activePage === "faq" ? "active" : ""}
                    onClick={() => setActivePage("faq")}
                    >
                        FAQ
                    </button>
                </li>
                </ul>

            </div>
        </div>
    );
};

export default Sidebar;
