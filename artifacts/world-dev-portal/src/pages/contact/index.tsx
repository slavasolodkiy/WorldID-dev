import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, MessageSquare, Users, Globe, Code2, Bug, Building } from "lucide-react";
import { useSubmitContactForm } from "@workspace/api-client-react";

const inquiryTypes = [
  {
    key: "general",
    label: "General Support",
    icon: MessageSquare,
    description: "Questions about the platform, APIs, or getting started.",
  },
  {
    key: "partner",
    label: "Partner Inquiry",
    icon: Users,
    description: "Business partnerships, co-marketing, and integration collaborations.",
  },
  {
    key: "orb-provider",
    label: "Orb Provider",
    icon: Globe,
    description: "Become an Orb operator or inquire about Orb deployment in your region.",
  },
  {
    key: "integration",
    label: "Integration Help",
    icon: Code2,
    description: "Technical help with SDKs, API integration, or production troubleshooting.",
  },
  {
    key: "bug-report",
    label: "Bug Report",
    icon: Bug,
    description: "Report issues with SDKs, APIs, or the developer portal.",
  },
  {
    key: "enterprise",
    label: "Enterprise",
    icon: Building,
    description: "High-volume usage, SLAs, dedicated support, and enterprise agreements.",
  },
];

export default function Contact() {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [ticketId, setTicketId] = React.useState("");

  const { mutate: submitForm, isPending } = useSubmitContactForm({
    mutation: {
      onSuccess: (data) => {
        setSuccess(true);
        setTicketId(data.ticketId);
      },
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    submitForm({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        type: selectedType as "general" | "partner" | "orb-provider" | "integration" | "bug-report" | "enterprise",
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        company: formData.get("company") as string || undefined,
      },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Message received</h2>
          <p className="text-muted-foreground mb-4">
            We will respond within 1-2 business days.
          </p>
          <div className="bg-card border border-border/40 rounded-lg px-4 py-3 mb-8">
            <div className="text-xs text-muted-foreground mb-1">Ticket ID</div>
            <div className="font-mono text-sm">{ticketId}</div>
          </div>
          <Button onClick={() => { setSuccess(false); setSelectedType(null); }} variant="outline">
            Submit another inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <Badge variant="outline" className="text-xs mb-4">Support</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact & Support</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Choose the right channel for your inquiry. We route each type to the right team 
            to get you a faster, more relevant response.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="max-w-4xl">
          {/* Type selection */}
          {!selectedType ? (
            <div>
              <h2 className="text-lg font-semibold mb-6">What can we help with?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inquiryTypes.map(({ key, label, icon: Icon, description }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className="text-left border border-border/40 rounded-xl p-5 hover:border-border hover:bg-card/50 transition-all group"
                  >
                    <Icon className="w-5 h-5 text-primary mb-3" />
                    <div className="font-medium mb-1 group-hover:text-primary transition-colors">{label}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedType(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 flex items-center gap-2"
              >
                &larr; Change inquiry type
              </button>

              <div className="flex items-center gap-3 mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                {(() => {
                  const type = inquiryTypes.find((t) => t.key === selectedType);
                  if (!type) return null;
                  const Icon = type.icon;
                  return (
                    <>
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@company.com" />
                  </div>
                </div>

                {(selectedType === "partner" || selectedType === "enterprise" || selectedType === "orb-provider") && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input id="company" name="company" placeholder="Your company name" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder={
                      selectedType === "bug-report"
                        ? "Brief description of the issue"
                        : selectedType === "orb-provider"
                        ? "Region and deployment context"
                        : "What is this about?"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {selectedType === "bug-report" ? "Steps to reproduce" : "Message"}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder={
                      selectedType === "bug-report"
                        ? "1. What you were doing\n2. What happened\n3. What you expected\n\nSDK version, environment, error messages..."
                        : selectedType === "orb-provider"
                        ? "Tell us about your location, infrastructure, and deployment experience..."
                        : "Describe your question or request in detail..."
                    }
                    className="resize-none"
                  />
                </div>

                <Button type="submit" size="lg" disabled={isPending} className="h-11 px-8">
                  {isPending ? "Sending..." : "Send message"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
