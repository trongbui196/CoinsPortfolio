import { Button } from "@mui/material";
import React from "react";

export function HeroSection() {
  return (
    <section className="container grid lg:grid-cols-2 gap-8 py-16 md:py-24">
      <div className="flex flex-col justify-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Buy & Sell
          <br />
          <span className="text-blue-500">Crypto Instant</span>
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
          Safe secure trusted Exchange Trade Bitcoin, Ethereum, Ripple and many
          more cryptocurrencies
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Start Trading
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          {["Logoipsum", "Logoipsum", "Logoipsum"].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <div className="h-8 w-8 rounded-full bg-gray-800" />
              {name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <img
          src="/placeholder.svg"
          alt="Trading Dashboard"
          className="rounded-lg shadow-2xl w-full max-w-2xl"
        />
      </div>
    </section>
  );
}
