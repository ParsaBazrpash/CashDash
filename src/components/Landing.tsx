'use client';
import React from 'react';
import { DollarSign, PieChart, Shield, LineChart, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0B4371] mb-6">
          Take Control of Your Finances
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track your spending, monitor your income, and achieve your financial goals 
          with our intuitive personal finance tracker.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="inline-block">
            <button className="w-full bg-[#0B4371] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#052640] transition-colors inline-flex items-center justify-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          
          <Link href="/dashboard" className="inline-block">
            <button className="w-full bg-white text--[#0B4371] border-2 border-[#0B4371] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2">
              Go To My Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-[#0B4371] mb-12">
          Everything You Need to Manage Your Money
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-300 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text--[#0B4371]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Transactions</h3>
            <p className="text-[#0B4371]">
              Easily record and categorize your income and expenses. Stay on top of 
              your spending with real-time balance updates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-300 rounded-lg flex items-center justify-center mb-4">
              <LineChart className="w-6 h-6 text-green-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
            <p className="text-[#0B4371]">
              View your financial trends with beautiful charts and graphs. Understand 
              your spending patterns at a glance.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-purple-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-300 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-900" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time-Based Analysis</h3>
            <p className="text-[#0B4371]">
              Analyze your finances across different time periods. Track your progress 
              weekly, monthly, or yearly.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-[#0B4371] font-bold text-center mb-12">
            Why CashDash?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-[#0B4371]">
                  Your financial data is stored locally in your browser. We don&apos;t 
                  collect or store any of your sensitive information on our servers.
                </p>
              </div>
            </div>
            <div className="bg-red-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <PieChart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multi-Currency Support</h3>
                <p className="text-[#0B4371]">
                  Track your finances in multiple currencies. Perfect for international 
                  users or tracking foreign investments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0B4371] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already tracking their finances with our app.
          </p>
          <Link href="/dashboard">
          <button className="bg-white text-[#0B4371] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
            Start Tracking Now
            <ArrowRight className="w-5 h-5" />
          </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} CashDash. All rights reserved.
              Developed by Parsa Bazrpash
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}