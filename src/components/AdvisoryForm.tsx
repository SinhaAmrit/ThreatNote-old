import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SeverityBadge } from "./SeverityBadge";

export interface AdvisoryData {
  id: string;
  name: string;
  attackType: string;
  vulnerability: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  date: string;
  threatActor: string;
  deliveryMethod: string;
  summary: string;
  readMoreLink: string;
  mitigation: string;
  references: string[];
}

interface AdvisoryFormProps {
  advisory: AdvisoryData;
  onUpdate: (advisory: AdvisoryData) => void;
  index: number;
}

export function AdvisoryForm({ advisory, onUpdate, index }: AdvisoryFormProps) {
  const defaultValues = {
    name: advisory.name || "",
    attackType: advisory.attackType || "",
    vulnerability: advisory.vulnerability || "",
    severity: advisory.severity || "informational",
    threatActor: advisory.threatActor || "",
    deliveryMethod: advisory.deliveryMethod || "",
    summary: advisory.summary || "",
    readMoreLink: advisory.readMoreLink || "",
    mitigation: advisory.mitigation || "",
    references: advisory.references || []
  };

  const form = useForm({
    defaultValues,
    mode: "onChange"
  });

  const onSubmit = (data: any) => {
    onUpdate({
      ...advisory,
      ...data
    });
  };

  // Watch for changes and update parent
  const watchedValues = form.watch();
  useEffect(() => {
    onUpdate({
      ...advisory,
      ...watchedValues
    });
  }, [watchedValues, advisory, onUpdate]);

  return (
    <Card className="card-corporate animate-slide-up hover-glow" style={{ animationDelay: `${index * 150}ms` }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-semibold text-primary">
          <span>Threat Advisory #{index + 1}</span>
          <div className="severity-badge-hover">
            <SeverityBadge severity={advisory.severity} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    Name *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter threat/vulnerability name"
                      className="input-ltim"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="attackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-primary">
                      Attack Type *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Remote Code Execution"
                        className="input-ltim"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-primary">
                      Severity *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="select-ltim">
                          <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="informational">Informational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vulnerability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    Vulnerability *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the vulnerability"
                      className="textarea-ltim min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="threatActor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-primary">
                      Threat Actor
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., APT Group Name"
                        className="input-ltim"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-primary">
                      Delivery Method
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Email, Exploit Kit"
                        className="input-ltim"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    Summary *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the threat advisory"
                      className="textarea-ltim min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="readMoreLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    Read More Link
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/detailed-report"
                      className="input-ltim"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mitigation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    Mitigation *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Recommended actions and mitigation steps"
                      className="textarea-ltim min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="references"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-primary">
                    References (comma-separated URLs, 1-2 links)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="https://example.com/advisory, https://cve.mitre.org"
                      className="textarea-ltim"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => field.onChange(e.target.value.split(",").map(item => item.trim()).filter(Boolean))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}