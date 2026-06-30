import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Play,
  Pause,
  RotateCcw,
  Grid3X3,
  Maximize,
  Settings,
  X,
  Video,
  Users,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/use-page-title";

// Mock data for players
interface Player {
  id: string;
  name: string;
  isStreaming: boolean;
  streamUrl?: string;
  lastActivity: string;
}

// Mock player data
const mockPlayers: Player[] = [
  {
    id: "1",
    name: "xX_ProGamer_Xx",
    isStreaming: true,
    lastActivity: "2m ago",
  },
  {
    id: "2",
    name: "NoobSlayer2024",
    isStreaming: true,
    lastActivity: "5m ago",
  },
  {
    id: "3",
    name: "SpeedRacer99",
    isStreaming: false,
    lastActivity: "12m ago",
  },
  { id: "4", name: "L33tHacker", isStreaming: true, lastActivity: "1m ago" },
  { id: "5", name: "AdminJohn", isStreaming: true, lastActivity: "8m ago" },
  { id: "6", name: "SuperAdmin", isStreaming: false, lastActivity: "15m ago" },
  { id: "7", name: "TestPlayer", isStreaming: true, lastActivity: "3m ago" },
  { id: "8", name: "RandomUser123", isStreaming: true, lastActivity: "7m ago" },
  {
    id: "9",
    name: "CheatDetected",
    isStreaming: false,
    lastActivity: "20m ago",
  },
  {
    id: "10",
    name: "SuspiciousPlayer",
    isStreaming: true,
    lastActivity: "4m ago",
  },
  { id: "11", name: "NewPlayer001", isStreaming: true, lastActivity: "1m ago" },
  { id: "12", name: "VeteranGamer", isStreaming: true, lastActivity: "6m ago" },
  { id: "13", name: "StreamerPro", isStreaming: true, lastActivity: "2m ago" },
  { id: "14", name: "GameMaster", isStreaming: false, lastActivity: "18m ago" },
  { id: "15", name: "PlayerX", isStreaming: true, lastActivity: "4m ago" },
];

interface StreamTile {
  id: string;
  playerId: string;
  playerName: string;
}

export function MultiStreamPage() {
  const { serverId } = useParams<{ serverId: string }>();
  usePageTitle("Multi Stream");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [activeStreams, setActiveStreams] = useState<StreamTile[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  // Calculate optimal grid layout based on stream count
  const getGridLayout = (streamCount: number) => {
    if (streamCount === 0) return { cols: 1, rows: 1, gridClass: "" };
    if (streamCount === 1)
      return { cols: 1, rows: 1, gridClass: "grid-cols-1 grid-rows-1" };
    if (streamCount === 2)
      return { cols: 2, rows: 1, gridClass: "grid-cols-2 grid-rows-1" };
    if (streamCount === 3)
      return { cols: 3, rows: 1, gridClass: "grid-cols-3 grid-rows-1" };
    if (streamCount === 4)
      return { cols: 2, rows: 2, gridClass: "grid-cols-2 grid-rows-2" };
    if (streamCount <= 6)
      return { cols: 3, rows: 2, gridClass: "grid-cols-3 grid-rows-2" };
    if (streamCount <= 8)
      return { cols: 4, rows: 2, gridClass: "grid-cols-4 grid-rows-2" };
    return { cols: 3, rows: 3, gridClass: "grid-cols-3 grid-rows-3" };
  };

  const currentLayout = getGridLayout(activeStreams.length);

  // Filter and sort players
  const filteredPlayers = mockPlayers
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.id.includes(searchQuery),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "id":
          return a.id.localeCompare(b.id);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Add player to stream grid
  const addToStream = (player: Player) => {
    if (activeStreams.length >= 9) return; // 3x3 grid limit
    if (activeStreams.some((stream) => stream.playerId === player.id)) return; // Already streaming

    const newStream: StreamTile = {
      id: `stream_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
    };

    setActiveStreams((prev) => [...prev, newStream]);
  };

  // Remove stream
  const removeStream = (streamId: string) => {
    setActiveStreams((prev) => prev.filter((stream) => stream.id !== streamId));
  };

  // Live video stream component
  const StreamTileComponent = ({ stream }: { stream: StreamTile }) => (
    <div className="relative w-full aspect-video bg-black overflow-hidden m-0 p-0 border-0">
      {/* Live video feed */}
      <video
        className="w-full h-full object-cover m-0 p-0 border-0 block"
        autoPlay
        muted
        loop
        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMzYwIiBmaWxsPSIjMTExODI3Ii8+CjxnIG9wYWNpdHk9IjAuNSI+CjxwYXRoIGQ9Ik0yODUgMTU1VjIwNUgzMzVWMTU1SDI4NVoiIGZpbGw9IiM2MzY5N0EiLz4KPHA+YXRoIGQ9Ik0zMTAgMTcwQzMxMyAyMDcgMzE3IDIwNSAzMTggMjA1QzMxOSAyMDUgMzI1IDIwNCAzMjUgMTgwQzMyNSAxNTYgMzE4IDE1NSAzMTggMTU1QzMxOCAxNTUgMzEzIDEyNyAzMTAgMTcwWiIgZmlsbD0iIzYzNjk3QSIvPgo8L2c+Cjx0ZXh0IHg9IjMyMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2MzY5N0EiPkxJVkUgU1RSRUFNPC90ZXh0Pgo8L3N2Zz4K"
      >
        <source src={`https://vjs.zencdn.net/v/oceans.mp4`} type="video/mp4" />
        <source
          src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
          type="video/mp4"
        />
        {/* Fallback for browsers that don't support video */}
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Live Stream</p>
          </div>
        </div>
      </video>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* Player username (top left) */}
      <div className="absolute top-3 left-3">
        <span className="text-white text-sm font-semibold bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
          {stream.playerName}
        </span>
      </div>

      {/* Close button (top right) */}
      <Button
        onClick={() => removeStream(stream.id)}
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 h-8 w-8 p-0 bg-black/70 backdrop-blur-sm hover:bg-red-500/80 text-white opacity-80 hover:opacity-100 transition-all duration-200 rounded-lg shadow-lg"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Live indicator (bottom left) */}
      <div className="absolute bottom-3 left-3">
        <div className="flex items-center gap-2 text-xs text-white bg-red-500/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden bg-background m-0 p-0 relative">
      {/* Main content with enhanced blur effect */}
      <div className="h-full flex flex-col m-0 p-0 relative backdrop-blur-md bg-background/50">
        {/* Header */}
        <div className="py-2 px-2 border-b border-border">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Multi Stream</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Multi Stream Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Monitor multiple player streams in real-time
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-400 border-green-500/30"
              >
                <Users className="h-3 w-3 mr-1" />
                {filteredPlayers.filter((p) => p.isStreaming).length} Streaming
              </Badge>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30"
              >
                {activeStreams.length}/9 Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-border flex flex-col bg-muted/30">
            {/* Search and Filter */}
            <div className="p-3 border-b border-border space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Sort by ID</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Players ({filteredPlayers.length})
                </h3>

                {filteredPlayers.map((player) => (
                  <Card
                    key={player.id}
                    className={`cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
                      player.isStreaming ? "border-primary/30" : "border-border"
                    } ${
                      activeStreams.some((s) => s.playerId === player.id)
                        ? "bg-primary/10 border-primary/50"
                        : ""
                    }`}
                    onClick={() => player.isStreaming && addToStream(player)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-xs truncate">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {player.lastActivity}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {player.isStreaming && (
                            <div className="flex items-center gap-1 text-xs text-green-400">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                              LIVE
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Main Stream Panel */}
          <div className="flex-1 flex flex-col">
            {/* Stream Grid */}
            <div className="flex-1 p-0">
              {activeStreams.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No Active Streams
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Click on streaming players from the sidebar to add them to
                      the grid
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Up to 9 streams supported (auto-layout)
                    </Badge>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid ${currentLayout.gridClass} gap-0 h-full w-full m-0 p-0`}
                >
                  {activeStreams.map((stream) => (
                    <StreamTileComponent key={stream.id} stream={stream} />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Toolbar */}
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                {/* Playback Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-background/50"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? "Pause All" : "Play All"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {/* Layout Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/50"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/50"
                  >
                    <Maximize className="h-4 w-4 mr-2" />
                    Fullscreen
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Coming Soon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-background/60">
        <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md mx-4">
          <div className="text-2xl font-bold text-foreground mb-2">
            Coming Soon
          </div>
          <div className="text-lg font-semibold text-primary mb-4">
            Multi-Stream Dashboard
          </div>
          <p className="text-muted-foreground">
            This feature is currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
