import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, Download, ExternalLink, BookOpen } from "lucide-react";
import AppHeader from "./AppHeader";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";

interface PDFResource {
  id: string;
  title: string;
  description: string;
  filename: string;
  size: string;
  pages: number;
  category: string;
  lastUpdated: string;
}

const ResourcesPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const pdfResources: PDFResource[] = [
    {
      id: "fiba-rules-2024",
      title: "FIBA Official Basketball Rules 2024",
      description:
        "The complete official basketball rules as established by FIBA (International Basketball Federation). This comprehensive document covers all aspects of the game including court specifications, equipment, game procedures, violations, fouls, and officiating guidelines.",
      filename: "FIBAOfficialBasketballRules2024_v1.0__.pdf",
      size: "2.1 MB",
      pages: 98,
      category: "Official Rules",
      lastUpdated: "2024",
    },
    {
      id: "fiba-interpretations",
      title: "FIBA Official Interpretations",
      description:
        "Official interpretations and clarifications of basketball rules by FIBA. This document provides detailed explanations of complex rule situations, case studies, and official guidance for referees and officials on how to apply the rules in various game scenarios.",
      filename: "FIBAOfficialInterpretations_v4_0a_yellow.pdf",
      size: "1.8 MB",
      pages: 156,
      category: "Rule Interpretations",
      lastUpdated: "Version 4.0a",
    },
  ];

  const handleDownload = (filename: string, title: string) => {
    const link = document.createElement("a");
    link.href = `/${filename}`;
    link.download = filename;
    link.setAttribute("aria-label", `Download ${title}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (filename: string, title: string) => {
    const url = `/${filename}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="container mx-auto px-4 py-8">
        <AppHeader
          showHistoryButton={false}
          showProfileButton={false}
          onSignOut={handleSignOut}
        />

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-orange-400" />
              Official Resources
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Access official FIBA basketball rules and interpretations. These
              documents are essential references for understanding the complete
              rulebook and official interpretations used in international
              basketball competitions.
            </p>
          </div>

          <div className="grid gap-6">
            {pdfResources.map((resource) => (
              <Card
                key={resource.id}
                className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-6 w-6 text-orange-400" />
                        <CardTitle className="text-white text-xl">
                          {resource.title}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="bg-orange-400/20 text-orange-300 border-orange-400/30"
                        >
                          {resource.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/70"
                        >
                          {resource.pages} pages
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/70"
                        >
                          {resource.size}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/70"
                        >
                          Updated: {resource.lastUpdated}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-white/70 text-base leading-relaxed">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() =>
                        handleView(resource.filename, resource.title)
                      }
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                      aria-label={`View ${resource.title} in new tab`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View PDF
                    </Button>
                    <Button
                      onClick={() =>
                        handleDownload(resource.filename, resource.title)
                      }
                      variant="outline"
                      className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10"
                      aria-label={`Download ${resource.title}`}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/60">
                      <strong className="text-white/80">Accessibility:</strong>{" "}
                      These PDF documents are optimized for screen readers and
                      include proper document structure. Use your browser's
                      built-in PDF viewer or download to access with assistive
                      technologies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              About These Resources
            </h2>
            <div className="space-y-4 text-white/80">
              <p>
                These official FIBA documents represent the authoritative source
                for basketball rules and interpretations used in international
                competition. They are regularly updated to reflect the latest
                rule changes and clarifications.
              </p>
              <p>
                <strong className="text-white">For Officials:</strong> These
                documents are essential for understanding the complete rulebook
                and should be studied alongside practical training and
                certification programs.
              </p>
              <p>
                <strong className="text-white">For Players and Coaches:</strong>{" "}
                Understanding these rules will help improve game knowledge and
                strategic decision-making.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
