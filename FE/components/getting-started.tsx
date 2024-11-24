import { Card, CardContent } from "@mui/material";
import { UserPlus, ShieldCheck, Wallet, TrendingUp } from "lucide-react";
import React from "react";

const steps = [
  {
    title: "Create an Account",
    description: "Sign up for your free account",
    icon: UserPlus,
  },
  {
    title: "Verify Bank Account",
    description: "Connect your bank account",
    icon: ShieldCheck,
  },
  {
    title: "Add Funds to Wallet",
    description: "Deposit funds to start trading",
    icon: Wallet,
  },
  {
    title: "Start Trading Instantly",
    description: "Buy & sell crypto right away",
    icon: TrendingUp,
  },
];

export function GettingStarted() {
  return (
    <section className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Easy Way to Get Started</h2>
        <p className="text-muted-foreground">
          Begin your crypto journey in just a few simple steps
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="bg-card/50">
            <CardContent className="p-6">
              <step.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
