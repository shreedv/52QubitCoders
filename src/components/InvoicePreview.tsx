
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";

interface InvoiceData {
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  vendorName?: string;
  total?: string;
  subtotal?: string;
  tax?: string;
  lineItems?: Array<{
    description?: string;
    quantity?: string;
    unitPrice?: string;
    amount?: string;
  }>;
  [key: string]: any;
}

interface InvoicePreviewProps {
  data: InvoiceData | null;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  const confidence = {
    high: ["invoiceNumber", "total", "vendorName"],
    medium: ["date", "subtotal"],
    low: ["tax", "dueDate"],
  };

  const getConfidenceIcon = (field: string) => {
    if (confidence.high.includes(field)) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (confidence.medium.includes(field)) {
      return <Check className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {Object.entries(data)
            .filter(([key]) => key !== "lineItems")
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getConfidenceIcon(key)}
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                </div>
                <span className="font-medium">{value}</span>
              </div>
            ))}

          {data.lineItems && data.lineItems.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Line Items</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td className="py-1">{item.description}</td>
                      <td className="py-1 text-right">{item.quantity}</td>
                      <td className="py-1 text-right">{item.unitPrice}</td>
                      <td className="py-1 text-right">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
