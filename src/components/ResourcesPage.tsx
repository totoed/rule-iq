import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  GraduationCap,
  Globe,
  Star,
  Calendar,
  Filter,
} from "lucide-react";
import BasketballIcon from "./BasketballIcon";

interface Resource {
  id: string;
  title: string;
  author: string;
  description: string;
  type: "book" | "video" | "article" | "document" | "course" | "website";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  url: string;
  featured: boolean;
  dateAdded: string;
}

interface ResourcesData {
  resources: Resource[];
}

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Load resources data
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Try to load from JSON file
        const response = await fetch("/src/data/resources.json");
        if (response.ok) {
          const data: ResourcesData = await response.json();
          setResources(data.resources);
        } else {
          throw new Error("Failed to load resources");
        }
      } catch (error) {
        console.log("Loading fallback resources data");
        // Fallback to sample data
        setResources(getSampleResources());
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  // Get unique categories, types, and difficulties
  const categories = useMemo(() => {
    const cats = [...new Set(resources.map((r) => r.category))].sort();
    return cats;
  }, [resources]);

  const types = useMemo(() => {
    const typesList = [...new Set(resources.map((r) => r.type))].sort();
    return typesList;
  }, [resources]);

  const difficulties = ["beginner", "intermediate", "advanced"];

  // Filter resources based on current filters
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply tab filter
    if (activeTab === "featured") {
      filtered = filtered.filter((r) => r.featured);
    } else if (activeTab === "recent") {
      filtered = filtered
        .sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        )
        .slice(0, 10);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((r) => r.difficulty === selectedDifficulty);
    }

    return filtered;
  }, [
    resources,
    searchTerm,
    selectedCategory,
    selectedType,
    selectedDifficulty,
    activeTab,
  ]);

  // Group resources by category for the "By Category" tab
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<string, Resource[]> = {};
    resources.forEach((resource) => {
      if (!grouped[resource.category]) {
        grouped[resource.category] = [];
      }
      grouped[resource.category].push(resource);
    });
    return grouped;
  }, [resources]);

  // Get icon for resource type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <Download className="h-4 w-4" />;
      case "course":
        return <GraduationCap className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedDifficulty("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <BasketballIcon size="lg" className="mx-auto mb-4" />
          <p>Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Header */}
      <header className="bg-navy/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <BasketballIcon size="md" />
              <div>
                <h1 className="text-2xl font-bold">RULE IQ</h1>
                <p className="text-sm text-white/60">RESOURCES</p>
              </div>
            </Link>
            <Link to="/app">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            Basketball Officiating Resources
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive collection of rules, training materials, and reference
            guides for basketball officials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          <div className="text-sm text-white/70">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 mb-8">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-600"
            >
              All Resources
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-blue-600"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="data-[state=active]:bg-blue-600"
            >
              By Category
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-blue-600"
            >
              Recently Added
            </TabsTrigger>
          </TabsList>

          {/* All Resources Tab */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Featured Resources Tab */}
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* By Category Tab */}
          <TabsContent value="category">
            <div className="space-y-8">
              {Object.entries(resourcesByCategory).map(
                ([category, categoryResources]) => (
                  <div key={category}>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </TabsContent>

          {/* Recently Added Tab */}
          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-white/70 mb-4">
              No resources found matching your criteria
            </p>
            <Button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Resource Card Component
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <Download className="h-4 w-4" />;
      case "course":
        return <GraduationCap className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(resource.type)}
            <Badge variant="secondary" className="text-xs">
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </Badge>
            {resource.featured && (
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            )}
          </div>
          <Badge className={getDifficultyColor(resource.difficulty)}>
            {resource.difficulty.charAt(0).toUpperCase() +
              resource.difficulty.slice(1)}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white line-clamp-2">
          {resource.title}
        </CardTitle>
        <p className="text-sm text-white/70">by {resource.author}</p>
      </CardHeader>
      <CardContent>
        <p className="text-white/80 text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-white/30 text-white/70"
            >
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs border-white/30 text-white/70"
            >
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Calendar className="h-3 w-3" />
            {new Date(resource.dateAdded).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            {resource.type === "document" ? (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample resources data as fallback
const getSampleResources = (): Resource[] => [
  {
    id: "1",
    title: "FIBA Official Basketball Rules 2023",
    author: "FIBA",
    description:
      "Complete official rules for international basketball competition including recent rule changes and interpretations.",
    type: "document",
    category: "Rules",
    difficulty: "intermediate",
    tags: ["FIBA", "official", "international", "2023"],
    url: "https://www.fiba.basketball/documents/official-basketball-rules.pdf",
    featured: true,
    dateAdded: "2023-09-15",
  },
  {
    id: "2",
    title: "NBA Referee Training Manual",
    author: "NBA Officials",
    description:
      "Comprehensive training manual covering all aspects of NBA officiating including mechanics and positioning.",
    type: "document",
    category: "Training",
    difficulty: "advanced",
    tags: ["NBA", "training", "mechanics", "positioning"],
    url: "https://official.nba.com/referee-training-manual",
    featured: true,
    dateAdded: "2023-08-20",
  },
  {
    id: "3",
    title: "Basketball Officiating Fundamentals",
    author: "John Smith",
    description:
      "Essential guide for new basketball officials covering basic rules, mechanics, and game management.",
    type: "book",
    category: "Fundamentals",
    difficulty: "beginner",
    tags: ["basics", "new officials", "fundamentals"],
    url: "https://example.com/officiating-fundamentals",
    featured: false,
    dateAdded: "2023-07-10",
  },
];

export default ResourcesPage;
