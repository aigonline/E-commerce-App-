import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BidHistory() {
  return (
    <div className="mt-4 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bidder</TableHead>
            <TableHead>Bid Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bidHistory.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={bid.bidder.avatar || "/placeholder.svg"} alt={bid.bidder.name} />
                    <AvatarFallback>{bid.bidder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{bid.bidder.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">${bid.amount.toFixed(2)}</TableCell>
              <TableCell>{bid.date}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    bid.status === "current" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {bid.status === "current" ? "Current bid" : "Outbid"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const bidHistory = [
  {
    id: "1",
    bidder: {
      name: "j***n",
      avatar: "/placeholder.svg",
    },
    amount: 120.5,
    date: "Jun 2, 2025 9:45 PM",
    status: "current",
  },
  {
    id: "2",
    bidder: {
      name: "s***h",
      avatar: "/placeholder.svg",
    },
    amount: 115.0,
    date: "Jun 2, 2025 8:30 PM",
    status: "outbid",
  },
  {
    id: "3",
    bidder: {
      name: "a***e",
      avatar: "/placeholder.svg",
    },
    amount: 110.0,
    date: "Jun 2, 2025 7:15 PM",
    status: "outbid",
  },
  {
    id: "4",
    bidder: {
      name: "m***k",
      avatar: "/placeholder.svg",
    },
    amount: 105.0,
    date: "Jun 1, 2025 10:20 PM",
    status: "outbid",
  },
  {
    id: "5",
    bidder: {
      name: "t***y",
      avatar: "/placeholder.svg",
    },
    amount: 100.0,
    date: "Jun 1, 2025 8:45 PM",
    status: "outbid",
  },
]
