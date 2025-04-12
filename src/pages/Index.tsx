
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InvoiceUpload from "@/components/InvoiceUpload";
import InvoicePreview from "@/components/InvoicePreview";
import TemplateSelector from "@/components/TemplateSelector";
import FieldMapping from "@/components/FieldMapping";
import { useToast } from "@/components/ui/use-toast";

type InvoiceData = {
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
};

type Template = {
  id: string;
  name: string;
  fields: string[];
};

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [invoiceImage, setInvoiceImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const templates: Template[] = [
    {
      id: "standard",
      name: "Standard Invoice",
      fields: ["invoiceNumber", "date", "vendorName", "total", "subtotal", "tax"],
    },
    {
      id: "detailed",
      name: "Detailed Invoice",
      fields: [
        "invoiceNumber",
        "date",
        "dueDate",
        "vendorName",
        "total",
        "subtotal",
        "tax",
        "lineItems",
      ],
    }
  ];

  const handleUpload = (file: File) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setInvoiceImage(e.target.result as string);
        
        // Simulate AI processing with a timeout
        setTimeout(() => {
          // Mock extracted data
          const mockData: InvoiceData = {
            invoiceNumber: "INV-2023-0042",
            date: "2025-04-10",
            dueDate: "2025-05-10",
            vendorName: "Acme Supplies Ltd.",
            total: "$1,246.50",
            subtotal: "$1,125.00",
            tax: "$121.50",
            lineItems: [
              {
                description: "Office Supplies",
                quantity: "5",
                unitPrice: "$45.00",
                amount: "$225.00",
              },
              {
                description: "Software License",
                quantity: "1",
                unitPrice: "$900.00",
                amount: "$900.00",
              },
            ],
          };
          
          setExtractedData(mockData);
          setIsProcessing(false);
          setActiveTab("review");
          
          toast({
            title: "Invoice Processed",
            description: "AI has extracted data from your invoice.",
          });
        }, 2000);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your filled template has been saved successfully.",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Invoice Smart Fill
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Automatically extract data from invoices and bills using AI and fill your templates with a single click
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="review" disabled={!extractedData}>Review</TabsTrigger>
            <TabsTrigger value="template" disabled={!extractedData}>Template</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upload">
          <Card>
            <CardContent className="p-6">
              <InvoiceUpload onUpload={handleUpload} isProcessing={isProcessing} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Invoice Image</h3>
                  {invoiceImage && (
                    <div className="border rounded-md overflow-hidden">
                      <img 
                        src={invoiceImage} 
                        alt="Uploaded Invoice" 
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Extracted Data</h3>
                  <InvoicePreview data={extractedData} />
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("template")}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md"
                    >
                      Continue to Template
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium mb-4">Choose Template</h3>
                  <TemplateSelector 
                    templates={templates} 
                    selectedTemplate={selectedTemplate}
                    onSelect={setSelectedTemplate}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Map Fields</h3>
                  {selectedTemplate ? (
                    <FieldMapping 
                      template={selectedTemplate}
                      extractedData={extractedData}
                      onSave={handleSaveTemplate}
                    />
                  ) : (
                    <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
                      Please select a template to continue
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Powered by AI to save you time and reduce manual data entry</p>
      </div>
    </div>
  );
};

export default Index;
