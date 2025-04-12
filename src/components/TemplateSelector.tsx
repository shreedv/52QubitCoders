
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  fields: string[];
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all hover:border-primary/50",
            selectedTemplate?.id === template.id
              ? "border-2 border-primary"
              : "border"
          )}
          onClick={() => onSelect(template)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-xs text-muted-foreground">
                {template.fields.length} fields
              </p>
            </div>
            {selectedTemplate?.id === template.id && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </CardContent>
        </Card>
      ))}
      
      <Card
        className="cursor-pointer border-dashed hover:border-primary/50"
      >
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            + Create custom template
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateSelector;
