import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Bid {
  id: string
  amount: number
  created_at: string
  bidder: {
    username: string
    avatar_url: string
  }
}

interface BidHistoryProps {
  bids: Bid[]
}

export function BidHistory({ bids }: BidHistoryProps) {
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
          {bids?.map((bid, index) => (
            <TableRow key={bid.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={bid.bidder.avatar_url} alt={bid.bidder.username} />
                    <AvatarFallback>{bid.bidder.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{bid.bidder.username}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">${bid.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(bid.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    index === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {index === 0 ? "Current bid" : "Outbid"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}