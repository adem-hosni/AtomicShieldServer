import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { Loader2, Search, Filter, Settings } from "lucide-react";

interface Configuration {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  defaultValue: any;
  tip?: string;
  category: string;
  section: string;
  options?: string[];
}

interface ConfigurationResponse {
  anticheat: any;
  configRegistry: Record<string, Configuration>;
  allConfigurations: Configuration[];
  totalConfigurations: number;
  serverId: string;
}

export function ConfigurationIterationExample() {
  const [configData, setConfigData] = useState<ConfigurationResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByType, setFilterByType] = useState<string>("all");
  const [filterByCategory, setFilterByCategory] = useState<string>("all");
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using server-1 as an example - in real app this would come from context/props
      const response = await api.config.getServerConfiguration("server-1");

      if (response.success && response.data) {
        setConfigData(response.data);

        // Initialize values with default values
        const initialValues: Record<string, any> = {};
        response.data.allConfigurations.forEach((config: Configuration) => {
          initialValues[config.id] = config.defaultValue;
        });
        setValues(initialValues);
      } else {
        setError(response.error || "Failed to load configuration");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Filter configurations based on search and filters
  const filteredConfigurations =
    configData?.allConfigurations.filter((config) => {
      const matchesSearch =
        config.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterByType === "all" || config.type === filterByType;
      const matchesCategory =
        filterByCategory === "all" || config.category === filterByCategory;

      return matchesSearch && matchesType && matchesCategory;
    }) || [];

  // Get unique types and categories for filters
  const uniqueTypes = [
    ...new Set(configData?.allConfigurations.map((c) => c.type) || []),
  ];
  const uniqueCategories = [
    ...new Set(configData?.allConfigurations.map((c) => c.category) || []),
  ];

  const handleValueChange = (configId: string, value: any) => {
    setValues((prev) => ({ ...prev, [configId]: value }));
  };

  const renderConfigurationField = (config: Configuration) => {
    const value = values[config.id];

    switch (config.type) {
      case "toggle":
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleValueChange(config.id, checked)}
          />
        );

      case "text":
      case "number":
        return (
          <Input
            type={config.type}
            value={value || ""}
            onChange={(e) =>
              handleValueChange(
                config.id,
                config.type === "number"
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
            placeholder={`Enter ${config.title.toLowerCase()}`}
            className="max-w-xs"
          />
        );

      case "dropdown":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleValueChange(config.id, val)}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue
                placeholder={`Select ${config.title.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Badge variant="outline" className="text-xs">
            {config.type}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading configurations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={loadConfiguration} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Configuration Iterator Example
            </h1>
            <p className="text-muted-foreground">
              Demonstrating how to iterate over all{" "}
              {configData?.totalConfigurations} configurations
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search configurations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterByType} onValueChange={setFilterByType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterByCategory}
              onValueChange={setFilterByCategory}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Badge variant="outline">
              Total: {configData?.totalConfigurations}
            </Badge>
            <Badge variant="outline">
              Filtered: {filteredConfigurations.length}
            </Badge>
            <Badge variant="outline">Types: {uniqueTypes.length}</Badge>
            <Badge variant="outline">
              Categories: {uniqueCategories.length}
            </Badge>
          </div>
        </div>

        {/* Configuration Grid - Iterating over all configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConfigurations.map((config) => (
            <Card
              key={config.id}
              className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">
                      {config.title}
                    </CardTitle>
                    {config.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {config.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {config.category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Configuration Field */}
                  <div>{renderConfigurationField(config)}</div>

                  {/* Metadata */}
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      <strong>ID:</strong> {config.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Section:</strong>{" "}
                      {config.section.replace(/_/g, " ")}
                    </div>
                    {config.tip && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> {config.tip}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      <strong>Default:</strong> {String(config.defaultValue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Current:</strong> {String(values[config.id])}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConfigurations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No configurations match your current filters.
            </p>
          </div>
        )}

        {/* Example Code */}
        <Card className="bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-primary/20">
          <CardHeader>
            <CardTitle>Example Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
              {`// Iterate over all configurations
configData.allConfigurations.forEach((config) => {
  console.log(\`\${config.title} (\${config.type}): \${values[config.id]}\`);
});

// Filter configurations by type
const toggleConfigs = configData.allConfigurations.filter(c => c.type === 'toggle');

// Group configurations by category
const byCategory = configData.allConfigurations.reduce((acc, config) => {
  if (!acc[config.category]) acc[config.category] = [];
  acc[config.category].push(config);
  return acc;
}, {});

// Access specific configuration by ID
const shieldConfig = configData.configRegistry['enable_shield'];

// Get all configuration IDs
const allIds = configData.allConfigurations.map(c => c.id);`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
