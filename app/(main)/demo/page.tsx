"use client";

import { Button } from "@/components/ui/button";
import { serviceHost } from "@/services";
import { useState } from "react";
import { QdrantSearchResponse } from "@/core";

const vectorDbService = serviceHost.vectorDbService();

const demo768Vector = Array.from({ length: 768 }, (_, i) => i + 1);
export default function DemoPage() {
  const [response, setResponse] = useState<QdrantSearchResponse | null>(null);
  const searchVectorDatabase = async () => {
    const response = await vectorDbService.search({
      vector: demo768Vector,
      collectionName: "test_collection",
      limit: 10,
    });

    setResponse(response);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">UI State Examples</h1>

      <Button className="mb-4" onClick={searchVectorDatabase}>
        Search Vector Database
      </Button>

      {response &&
        response.map((item, i) => (
          <div key={i} className="mb-2 p-4 border rounded">
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        ))}

      {!response && (
        <p className="text-gray-500">
          No results yet. Click the button to search.
        </p>
      )}
    </div>
  );
}
