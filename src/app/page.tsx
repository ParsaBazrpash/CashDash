import { Metadata } from "next"
import Landing from '../components/Landing'
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: 'CashDash',
  description: 'Track your income and expenses easily',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Landing />
    </main>
  )
}