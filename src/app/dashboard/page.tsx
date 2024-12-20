import { Metadata } from "next"
import Dashboard from "@/components/FinanceTracker"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: 'CashDash | Dashboard',
  
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <Dashboard />
    </main>
  )
}