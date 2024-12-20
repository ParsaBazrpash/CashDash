import { Metadata } from "next"
import Landing from "@/components/Landing"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: 'CashDash - Finance Tracker',
  
}

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <Navbar />
      <Landing />
    </main>
  )
}