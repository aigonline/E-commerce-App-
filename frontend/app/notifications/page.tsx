import React from "react";

const notifications = [
    {
        id: 1,
        title: "Order Shipped",
        message: "Your order #12345 has been shipped and is on its way!",
        time: "2 hours ago",
        type: "success",
    },
    {
        id: 2,
        title: "New Promotion",
        message: "Get 20% off on your next purchase. Limited time offer!",
        time: "5 hours ago",
        type: "promo",
    },
    {
        id: 3,
        title: "Payment Received",
        message: "We have received your payment for order #12345.",
        time: "1 day ago",
        type: "info",
    },
    {
        id: 4,
        title: "Order Delivered",
        message: "Your order #12345 has been delivered. Thank you!",
        time: "2 days ago",
        type: "success",
    },
];

const typeStyles: Record<string, string> = {
    success: "bg-green-100 border-green-400 text-green-800",
    promo: "bg-yellow-100 border-yellow-400 text-yellow-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
};

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-rose-500 text-center">
                    Notifications
                </h1>
                
            <div className="max-w-[90%] border rounded p-2 border-black mx-auto">
                
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`border-l-4 p-3 sm:p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start gap-3 sm:gap-4 ${typeStyles[notif.type]}`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {notif.type === "success" && (
                                    <span className="inline-block w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
                                        ✓
                                    </span>
                                )}
                                {notif.type === "promo" && (
                                    <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                                        %
                                    </span>
                                )}
                                {notif.type === "info" && (
                                    <span className="inline-block w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                        i
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="font-semibold text-base sm:text-lg">{notif.title}</h2>
                                <p className="text-xs sm:text-sm mt-1">{notif.message}</p>
                                <span className="text-xs text-gray-500 mt-2 block">{notif.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-center font-medium mt-6">Page under construction</p>
        </div>
    );
}