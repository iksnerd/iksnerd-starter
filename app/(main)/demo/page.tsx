"use client";

import { useState } from "react";
import { Inbox, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("loading");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">UI State Examples</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="loading">Loading States</TabsTrigger>
          <TabsTrigger value="error">Error States</TabsTrigger>
          <TabsTrigger value="empty">Empty States</TabsTrigger>
        </TabsList>

        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Default Loading</h2>
              <div className="border rounded-lg p-6">
                <LoadingState />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Custom Loading Text
              </h2>
              <div className="border rounded-lg p-6">
                <LoadingState text="Fetching your data..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Different Sizes</h2>
              <div className="border rounded-lg p-6 flex flex-col md:flex-row items-center justify-around gap-6">
                <LoadingState size="sm" text="Small" />
                <LoadingState size="md" text="Medium" />
                <LoadingState size="lg" text="Large" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Default Error</h2>
              <div className="border rounded-lg p-6">
                <ErrorState />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Custom Error with Retry
              </h2>
              <div className="border rounded-lg p-6">
                <ErrorState
                  title="Connection failed"
                  message="We couldn't connect to the server. Please check your internet connection and try again."
                  onRetry={() => alert("Retrying...")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="empty" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Default Empty State
              </h2>
              <div className="border rounded-lg p-6">
                <EmptyState />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Empty Inbox</h2>
              <div className="border rounded-lg p-6">
                <EmptyState
                  icon={<Inbox className="h-6 w-6 text-muted-foreground" />}
                  title="Your inbox is empty"
                  description="Messages you receive will appear here. Start a conversation to get the ball rolling."
                  actionLabel="Start a conversation"
                  onAction={() => alert("Starting conversation...")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">No Products</h2>
              <div className="border rounded-lg p-6">
                <EmptyState
                  icon={<Package className="h-6 w-6 text-muted-foreground" />}
                  title="No products found"
                  description="You haven't added any products to your store yet. Add your first product to get started."
                  actionLabel="Add product"
                  actionHref="#"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
