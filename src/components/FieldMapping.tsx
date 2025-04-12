
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Template {
  id: string;
  name: string;
  fields: string[];
}

interface InvoiceData {
  [key: string]: any;
}

interface FieldMappingProps {
  template: Template;
  extractedData: InvoiceData | null;
  onSave: () => void;
}

const FieldMapping: React.FC<FieldMappingProps> = ({
  template,
  extractedData,
  onSave,
}) => {
  const [formData, setFormData] = useState<InvoiceData>({});
  const [autoMapping, setAutoMapping] = useState(true);

  useEffect(() => {
    if (extractedData && autoMapping) {
      const initialData: InvoiceData = {};
      template.fields.forEach((field) => {
        if (extractedData[field] !== undefined) {
          initialData[field] = extractedData[field];
        } else {
          initialData[field] = "";
        }
      });
      setFormData(initialData);
    }
  }, [template, extractedData, autoMapping]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatFieldLabel = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Checkbox 
          id="autoMapping" 
          checked={autoMapping} 
          onCheckedChange={(checked) => setAutoMapping(!!checked)}
        />
        <Label htmlFor="autoMapping">Auto-map fields from extracted data</Label>
      </div>

      <div className="space-y-4">
        {template.fields.map((field) => (
          <div key={field} className="grid grid-cols-3 gap-4 items-center">
            <Label htmlFor={field} className="text-right">
              {formatFieldLabel(field)}:
            </Label>
            <Input
              id={field}
              value={formData[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="col-span-2"
            />
          </div>
        ))}

        {template.id === "detailed" && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Line Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Unit Price</th>
                    <th className="pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedData?.lineItems && extractedData.lineItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">{item.unitPrice}</td>
                      <td className="py-2">{item.amount}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="pt-2 text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        + Add line item
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>Save Template</Button>
      </div>
    </div>
  );
};

export default FieldMapping;
